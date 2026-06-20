import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendMessage(chatId: number, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
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
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text?.trim();

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  const telegramId = String(message.from?.id || chatId);
  const username = message.from?.username || "";
  const firstName = message.from?.first_name || "";

  if (text === "/start") {
    await sendMessage(
      chatId,
      `Welcome to <b>Viltrum Card</b>.\n\nSend your secret activation code to verify your order.\n\nExample:\n<code>VT-ABCD-1234-WXYZ</code>`
    );

    return NextResponse.json({ ok: true });
  }

  const code = text.toUpperCase();

  const { data: accessCode, error } = await supabase
    .from("access_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !accessCode) {
    await sendMessage(
      chatId,
      `Invalid activation code.\n\nPlease check your code and send it again.`
    );

    return NextResponse.json({ ok: true });
  }

  if (accessCode.used) {
    await sendMessage(
      chatId,
      `This activation code has already been used.`
    );

    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("access_codes")
    .update({
      telegram_id: telegramId,
      used: true
    })
    .eq("code", code);

  await supabase.from("bot_users").upsert({
    telegram_id: telegramId,
    telegram_username: username,
    first_name: firstName,
    access_code: code,
    order_id: accessCode.order_id,
    card_type: accessCode.card_type,
    verified: true
  });

  await supabase
    .from("orders")
    .update({
      telegram_id: telegramId,
      telegram_username: username,
      status: "verified"
    })
    .eq("id", accessCode.order_id);

  await sendMessage(
    chatId,
    `✅ <b>Activation Successful</b>\n\nYour Viltrum Card order is now verified.\n\n<b>Card Type:</b> ${accessCode.card_type}\n<b>Status:</b> Verified\n\nYou will receive card access updates here.`
  );

  return NextResponse.json({ ok: true });
}
