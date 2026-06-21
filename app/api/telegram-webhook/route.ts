import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendMessage(chatId: number | string, text: string, keyboard?: any) {
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
        parse_mode: "HTML",
        reply_markup: keyboard
      })
    }
  );
}

function mainKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "💳 My Card", callback_data: "my_card" }],
      [{ text: "📦 My Orders", callback_data: "my_orders" }],
      [{ text: "🚚 Track Shipment", callback_data: "track_shipment" }],
      [{ text: "💰 Check Balance", callback_data: "check_balance" }],
      [{ text: "➕ Reload Balance", callback_data: "reload_balance" }],
      [{ text: "➖ Withdraw", callback_data: "withdraw" }],
      [{ text: "🆘 Help & Support", callback_data: "support" }]
    ]
  };
}

function hiddenCardKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "👁 Show Full Card", callback_data: "show_full_card" }],
      [{ text: "⬅️ Back", callback_data: "back_home" }]
    ]
  };
}

function generateCardNumber() {
  return "4242 4242 4242 " + Math.floor(1000 + Math.random() * 9000);
}

function generateCvv() {
  return String(Math.floor(100 + Math.random() * 900));
}

function maskCardNumber(cardNumber: string) {
  const last4 = cardNumber.slice(-4);
  return `xxxx xxxx xxxx ${last4}`;
}

export async function POST(req: NextRequest) {
  const update = await req.json();

  if (update.callback_query) {
    const callback = update.callback_query;
    const chatId = callback.message.chat.id;
    const telegramId = String(callback.from.id);
    const action = callback.data;

    if (action === "back_home") {
      await sendMessage(
        chatId,
        "Welcome back to <b>Viltrum Card</b>.\n\nChoose an option below:",
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

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
          `Shipment: ${order.shipment_status || "Not started"}\n\n`;
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
        await sendMessage(chatId, "No card found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      if (
  order.card_type === "physical" &&
  order.status !== "approved" &&
  order.status !== "active"
) {
        await sendMessage(
          chatId,
          `💳 <b>Your Viltrum Card</b>\n\n` +
            `<b>Card Type:</b> ${order.card_type}\n` +
            `<b>Status:</b> ${order.status}\n` +
            `<b>Token ID:</b> ${order.token_id || "Pending"}\n\n` +
            `Your card is verified but waiting for admin approval.`,
          mainKeyboard()
        );

        return NextResponse.json({ ok: true });
      }

      let cardNumber = order.card_number;
      let cardExp = order.card_exp;
      let cardCvv = order.card_cvv;

      if (!cardNumber || !cardExp || !cardCvv) {
        cardNumber = generateCardNumber();
        cardExp = "12/30";
        cardCvv = generateCvv();

        await supabase
          .from("orders")
          .update({
            card_number: cardNumber,
            card_exp: cardExp,
            card_cvv: cardCvv,
            status: "active"
          })
          .eq("id", order.id);
      }

      await sendMessage(
        chatId,
        `💳 <b>Your Viltrum Card</b>\n\n` +
          `<b>Card Holder:</b> ${order.full_name || "Not set"}\n` +
          `<b>Card Number:</b> <code>${maskCardNumber(cardNumber)}</code>\n` +
          `<b>CVV:</b> <code>xxx</code>\n` +
          `<b>Expiry:</b> <code>xx/xx</code>\n` +
          `<b>Status:</b> Active\n\n` +
          `Tap below to reveal full card details.`,
        hiddenCardKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "show_full_card") {
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegramId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!order) {
        await sendMessage(chatId, "No card found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      if (order.status !== "approved" && order.status !== "active") {
        await sendMessage(chatId, "Your card is not approved yet.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `🔓 <b>Full Card Details</b>\n\n` +
          `<b>Card Holder:</b> ${order.full_name || "Not set"}\n` +
          `<b>Card Number:</b> <code>${order.card_number}</code>\n` +
          `<b>CVV:</b> <code>${order.card_cvv}</code>\n` +
          `<b>Expiry:</b> <code>${order.card_exp}</code>\n` +
          `<b>Status:</b> Active`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "track_shipment") {
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegramId)
        .eq("card_type", "physical")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!order) {
        await sendMessage(
          chatId,
          "📦 Track Shipment is available only for physical card buyers.",
          mainKeyboard()
        );

        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `📦 <b>Shipment Tracking</b>\n\n` +
          `<b>Order:</b> ${order.order_id}\n` +
          `<b>Status:</b> ${order.shipment_status || "Not started"}\n` +
          `<b>Note:</b> ${order.tracking_note || "Tracking will be updated manually."}`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "check_balance") {
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("telegram_id", telegramId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!order) {
        await sendMessage(chatId, "No card found.", mainKeyboard());
        return NextResponse.json({ ok: true });
      }

      await sendMessage(
        chatId,
        `💰 <b>Card Balance</b>\n\n` +
          `<b>Balance:</b> $0.00\n` +
          `<b>Status:</b> ${order.status}\n\n` +
          `Balance updates will be connected to the vault contract later.`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "reload_balance") {
      await sendMessage(
        chatId,
        `➕ <b>Reload Balance</b>\n\n` +
          `Reload will be handled through the Viltrum vault contract.\n\n` +
          `This feature will be enabled after vault deployment.`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "withdraw") {
      await sendMessage(
        chatId,
        `➖ <b>Withdraw</b>\n\n` +
          `Withdrawals will be handled through the Viltrum vault contract.\n\n` +
          `This feature will be enabled after vault deployment.`,
        mainKeyboard()
      );

      return NextResponse.json({ ok: true });
    }

    if (action === "support") {
      await sendMessage(
        chatId,
        `🆘 <b>Help & Support</b>\n\n` +
          `For help, send your issue in this chat.\n\n` +
          `Support team will review your message and respond as soon as possible.`,
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
      `Welcome to <b>Viltrum Card</b>.\n\n` +
        `Send your secret activation code to verify your order.\n\n` +
        `Example:\n<code>VT-ABCD-1234-WXYZ</code>`,
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
    await sendMessage(
      chatId,
      "Invalid activation code. Please check your code and send it again.",
      mainKeyboard()
    );

    return NextResponse.json({ ok: true });
  }

  if (accessCode.used) {
    await sendMessage(chatId, "This activation code has already been used.", mainKeyboard());
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

  const { data: currentOrder } = await supabase
  .from("orders")
  .select("card_type")
  .eq("id", accessCode.order_id)
  .single();

await supabase
  .from("orders")
  .update({
    telegram_id: telegramId,
    telegram_username: username,
    status:
      currentOrder?.card_type === "physical"
        ? "verified"
        : "active"
  })
  .eq("id", accessCode.order_id);

  if (currentOrder?.card_type === "physical") {
  await sendMessage(
    chatId,
    `✅ <b>Activation Successful</b>\n\n` +
      `Your physical card has been verified.\n\n` +
      `It is now awaiting admin approval and shipment.`,
    mainKeyboard()
  );
} else {
  await sendMessage(
    chatId,
    `🎉 <b>Card Activated Successfully</b>\n\n` +
      `Your ${currentOrder?.card_type} card is now ACTIVE.\n\n` +
      `Open My Card to view it.`,
    mainKeyboard()
  );
}
    mainKeyboard()
  );

  return NextResponse.json({ ok: true });
}
