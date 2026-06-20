import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const update = await req.json();

  const chatId = update.message?.chat?.id;

  if (chatId) {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Webhook connected successfully."
        })
      }
    );
  }

  return NextResponse.json({ ok: true });
}
