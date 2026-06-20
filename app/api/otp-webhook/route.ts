import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendMessage(chatId: number | string, text: string, keyboard?: any) {
  const res = await fetch(
    `https://api.telegram.org/bot${process.env.OTP_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: keyboard
      })
    }
  );

  const data = await res.json();
  console.log("OTP BOT SEND RESPONSE:", data);
  return data;
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    console.log("OTP UPDATE:", JSON.stringify(update));

    const message = update.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text?.trim() || "";

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    const telegramId = String(message.from?.id || chatId);
    const username = String(message.from?.username || "")
      .toLowerCase()
      .replace("@", "");

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();

    const { error } = await supabase.from("signup_otps").insert({
      telegram_id: telegramId,
      telegram_username: username,
      otp,
      used: false,
      expires_at: expiresAt
    });

    if (error) {
      console.log("OTP SUPABASE ERROR:", error.message);
      await sendMessage(chatId, `Database error: ${error.message}`);
      return NextResponse.json({ ok: true });
    }

    await sendMessage(
      chatId,
      `🔐 <b>Viltrum Signup OTP</b>\n\n` +
        `Your OTP is:\n\n` +
        `<code>${otp}</code>\n\n` +
        `This OTP is valid for <b>1 minute</b>.`,
      {
        inline_keyboard: [
          [
            {
              text: "Return To Signup",
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/signup`
            }
          ]
        ]
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.log("OTP WEBHOOK ERROR:", err.message);
    return NextResponse.json({ ok: true });
  }
}
