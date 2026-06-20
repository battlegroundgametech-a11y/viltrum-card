import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendMessage(
  chatId: number | string,
  text: string,
  keyboard?: any
) {
  await fetch(
    `https://api.telegram.org/bot${process.env.OTP_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: keyboard
      })
    }
  );
}

function generateOTP() {
  return String(
    Math.floor(100000 + Math.random() * 900000)
  );
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  const message = update.message;

  const chatId = message?.chat?.id;
  const text = message?.text?.trim();

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  const telegramId = String(message.from?.id);
  const username =
    (message.from?.username || "")
      .toLowerCase()
      .replace("@", "");

  if (
    text === "/start" ||
    text === "/start signup"
  ) {
    const otp = generateOTP();

    const expiresAt = new Date(
      Date.now() + 60 * 1000
    ).toISOString();

    await supabase.from("signup_otps").insert({
      telegram_id: telegramId,
      telegram_username: username,
      otp,
      used: false,
      expires_at: expiresAt
    });

    await sendMessage(
      chatId,
      `🔐 <b>Viltrum Signup OTP</b>\n\n` +
        `OTP:\n<code>${otp}</code>\n\n` +
        `Valid for 1 minute only.`,
      {
        inline_keyboard: [
          [
            {
              text: "Return To Signup",
              url:
                `${process.env.NEXT_PUBLIC_SITE_URL}` +
                `/signup`
            }
          ]
        ]
      }
    );

    return NextResponse.json({ ok: true });
  }

  await sendMessage(
    chatId,
    "Press /start to generate a signup OTP."
  );

  return NextResponse.json({ ok: true });
}
