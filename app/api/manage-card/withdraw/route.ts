import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderId = body.order_id;
    const wallet = String(body.wallet_address || "").toLowerCase();
    const amountUsdCents = Math.round(Number(body.amount_usd || 0) * 100);
    const txHash = String(body.tx_hash || "");

    if (!orderId || !wallet || amountUsdCents <= 0 || !txHash) {
      return NextResponse.json(
        { success: false, error: "Missing withdrawal data" },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, telegram_id, wallet_address, card_type")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (String(order.wallet_address).toLowerCase() !== wallet) {
      return NextResponse.json(
        { success: false, error: "Wallet does not match order" },
        { status: 403 }
      );
    }

    const { data: balance } = await supabase
      .from("card_balances")
      .select("balance_usd_cents")
      .eq("order_id", order.id)
      .maybeSingle();

    const currentBalance = Number(balance?.balance_usd_cents || 0);

    if (currentBalance < amountUsdCents) {
      return NextResponse.json(
        { success: false, error: "Insufficient card balance" },
        { status: 400 }
      );
    }

    const nextBalance = currentBalance - amountUsdCents;

    await supabase.from("card_balances").upsert(
      {
        order_id: order.id,
        telegram_id: order.telegram_id,
        wallet_address: wallet,
        card_type: order.card_type,
        balance_usd_cents: nextBalance,
        updated_at: new Date().toISOString()
      },
      { onConflict: "order_id" }
    );

    await supabase.from("card_balance_transactions").insert({
      order_id: order.id,
      telegram_id: order.telegram_id,
      wallet_address: wallet,
      card_type: order.card_type,
      type: "withdraw",
      amount_usd_cents: amountUsdCents,
      tx_hash: txHash,
      status: "completed"
    });

    return NextResponse.json({
      success: true,
      balance_usd_cents: nextBalance
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Withdrawal ledger failed" },
      { status: 500 }
    );
  }
}
