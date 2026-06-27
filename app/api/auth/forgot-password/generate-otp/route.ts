import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashValue(value: string, salt: string) {
  return crypto.pbkdf2Sync(value, salt, 100000, 64, "sha512").toString("hex");
}

function generateOTP() {
  return String(crypto.randomInt(100000, 1000000));
}

async function sendMessage(chatId: string, text: string) {
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.OTP_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      })
    }
  );

  return await res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = String(body.telegram_username || "")
      .replace("@", "")
      .trim()
      .toLowerCase();

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Telegram username is required" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("telegram_id, telegram_username, password_hash, password_salt")
      .eq("telegram_username", username)
      .single();

    if (!profile || !profile.telegram_id || !profile.password_hash || !profile.password_salt) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    const cooldownTime = new Date(Date.now() - 60 * 1000).toISOString();

    const { data: recentOtp } = await supabase
      .from("password_reset_otps")
      .select("id, created_at")
      .eq("telegram_username", username)
      .eq("used", false)
      .gt("created_at", cooldownTime)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentOtp) {
      return NextResponse.json(
        { success: false, error: "Please wait 60 seconds before requesting another OTP" },
        { status: 429 }
      );
    }

    const otp = generateOTP();
    const otpSalt = crypto.randomBytes(16).toString("hex");
    const otpHash = hashValue(otp, otpSalt);
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();

    const { error } = await supabase.from("password_reset_otps").insert({
      telegram_id: profile.telegram_id,
      telegram_username: username,
      otp_hash: otpHash,
      otp_salt: otpSalt,
      used: false,
      expires_at: expiresAt
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await sendMessage(
      profile.telegram_id,
      `🔐 <b>Viltrum Password Reset OTP</b>\n\n` +
        `Your reset OTP is:\n\n` +
        `<code>${otp}</code>\n\n` +
        `This OTP is valid for <b>1 minute</b>.`
    );

    return NextResponse.json({
      success: true,
      message: "Reset OTP sent to your Telegram bot chat"
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
