import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendMessage(chatId: number | string, text: string, keyboard?: any) {
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: keyboard
    })
  });
}

function mainKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "📦 My Orders", callback_data: "my_orders" }],
      [{ text: "💳 My Card", callback_data: "my_card" }],
      [{ text: "🎟 Access Codes", callback_data: "access_codes" }],
      [{ text: "🆘 Support", callback_data: "support" }]
    ]
  };
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  if (update.callback_query) {
    const callback = update.callback_query;
    const chatId = callback.message.chat.id;
    const telegramId = String(callback.from.id);
    const action = callback.data;

    if (action === "my_orders") {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegramId)
        .order("created_at", { ascending: false });

      if (!orders || orders.length === 0) {
        await sendMessage(chatId, "No orders found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      let text = "📦 <b>Your Orders</b>\n\n";

      orders.forEach((order: any) => {
        text +=
          `🧾 <b>${order.order_id}</b>\n` +
          `Card: ${order.card_type}\n` +
          `Status: ${order.status}\n` +
          `Shipment: ${order.shipment_status}\n\n`;
      });

      await sendMessage(chatId, text, mainKeyboard());
      return NextResponse.json({ ok: true });
    }

    if (action === "my_card") {
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegramId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!order) {
        await sendMessage(chatId, "No verified card found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `💳 <b>Your Viltrum Card</b>\n\n` +
          `<b>Card Type:</b> ${order.card_type}\n` +
          `<b>Status:</b> ${order.status}\n` +
          `<b>Token ID:</b> ${order.token_id || "Pending"}\n` +
          `<b>Card Holder:</b> ${order.full_name || "Not set"}\n\n` +
          `Card details will unlock after admin approval.`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "access_codes") {
      const { data: codes } = await supabase
        .from("access_codes")
        .select("*")
        .eq("telegram_id", telegramId)
        .order("created_at", { ascending: false });

      if (!codes || codes.length === 0) {
        await sendMessage(chatId, "No access codes found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      let text = "🎟 <b>Your Access Codes</b>\n\n";

      codes.forEach((code: any) => {
        text +=
          `<code>${code.code}</code>\n` +
          `Card: ${code.card_type}\n` +
          `Used: ${code.used ? "Yes" : "No"}\n\n`;
      });

      await sendMessage(chatId, text, mainKeyboard());
      return NextResponse.json({ ok: true });
    }

    if (action === "support") {
      await sendMessage(
        chatId,
        `🆘 <b>Support</b>\n\nSend your issue here, or contact the Viltrum admin team.`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }
  }

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
      `Welcome to <b>Viltrum Card</b>.\n\nSend your secret activation code to verify your order.\n\nExample:\n<code>VT-ABCD-1234-WXYZ</code>`,
      mainKeyboard()
    );

    return NextResponse.json({ ok: true });
  }

  const code = text.toUpperCase();

  const { data: accessCode } = await supabase
    .from("access_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (!accessCode) {
    await sendMessage(chatId, "Invalid activation code. Please check your code and send it again.", mainKeyboard());
    return NextResponse.json({ ok: true });
  }

  if (accessCode.used) {
    await sendMessage(chatId, "This activation code has already been used.", mainKeyboard());
    return NextResponse.json({ ok: true });
  }

  await supabase.from("access_codes").update({
    telegram_id: telegramId,
    used: true
  }).eq("code", code);

  await supabase.from("bot_users").upsert({
    telegram_id: telegramId,
    telegram_username: username,
    first_name: firstName,
    access_code: code,
    order_id: accessCode.order_id,
    card_type: accessCode.card_type,
    verified: true
  });

  await supabase.from("orders").update({
    telegram_id: telegramId,
    telegram_username: username,
    status: "verified"
  }).eq("id", accessCode.order_id);

  await sendMessage(
    chatId,
    `✅ <b>Activation Successful</b>\n\nWelcome to Viltrum.\n\nChoose an option below:`,
    mainKeyboard()
  );

  return NextResponse.json({ ok: true });
}
