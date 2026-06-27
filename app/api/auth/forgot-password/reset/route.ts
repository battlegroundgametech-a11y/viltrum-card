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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = String(body.telegram_username || "")
      .replace("@", "")
      .trim()
      .toLowerCase();

    const otp = String(body.otp || "").trim();
    const newPassword = String(body.new_password || "");
    const confirmPassword = String(body.confirm_password || "");

    if (!username || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { data: otpRow } = await supabase
      .from("password_reset_otps")
      .select("*")
      .eq("telegram_username", username)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!otpRow) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const otpCheckHash = hashValue(otp, otpRow.otp_salt);

    if (otpCheckHash !== otpRow.otp_hash) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }

    const passwordSalt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashValue(newPassword, passwordSalt);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        password_hash: passwordHash,
        password_salt: passwordSalt
      })
      .eq("telegram_username", username);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("password_reset_otps")
      .update({ used: true })
      .eq("telegram_username", username)
      .eq("used", false);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Password reset failed" },
      { status: 500 }
    );
  }
}
