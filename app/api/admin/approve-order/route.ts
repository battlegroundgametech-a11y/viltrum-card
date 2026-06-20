import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function notifyUser(telegramId: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: telegramId,
        parse_mode: "HTML",
        text:
          `✅ <b>Card Approved</b>\n\n` +
          `Your Viltrum Card request has been approved.\n\n` +
          `You can now open <b>My Card</b> to view your active card details.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "💳 View My Card", callback_data: "my_card" }],
            [{ text: "📦 My Orders", callback_data: "my_orders" }]
          ]
        }
      })
    }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.secret !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status: "approved"
    })
    .eq("id", body.order_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  if (order?.telegram_id) {
    await notifyUser(order.telegram_id);
  }

  return NextResponse.json({
    success: true
  });
}
