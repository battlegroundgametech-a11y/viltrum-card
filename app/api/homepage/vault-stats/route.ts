import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function money(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export async function GET() {
  try {
    const [
      ordersRes,
      transactionsRes,
      inventoryRes
    ] = await Promise.all([
      supabase.from("orders").select("card_type,status,created_at"),
      supabase.from("card_transactions").select("amount,created_at"),
      supabase.from("card_inventory").select("*").eq("id", 1).maybeSingle()
    ]);

    const orders = ordersRes.data || [];
    const transactions = transactionsRes.data || [];
    const inventory = inventoryRes.data;

    const totalVolume = transactions.reduce(
      (sum: number, tx: any) => sum + Number(tx.amount || 0),
      0
    );

    const physicalOrders = orders.filter(
      (order: any) => order.card_type === "physical"
    ).length;

    const activeCards = orders.filter(
      (order: any) => order.status === "active"
    ).length;

    const totalMinted = orders.length;

    const remainingCards =
      Number(inventory?.virtual_supply || 0) +
      Number(inventory?.physical_supply || 0) +
      Number(inventory?.free_supply || 0);

    const recentTransactions = [...transactions]
      .sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .slice(-7);

    const chart = recentTransactions.map((tx: any) =>
      Math.max(18, Math.min(100, Number(tx.amount || 0) * 8))
    );

    while (chart.length < 7) chart.unshift(18);

    return NextResponse.json({
      success: true,
      stats: {
        totalVolume: money(totalVolume),
        totalMinted: totalMinted.toLocaleString(),
        physicalOrders: physicalOrders.toLocaleString(),
        activeCards: activeCards.toLocaleString(),
        remainingCards: remainingCards.toLocaleString(),
        chart
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to load vault stats"
    });
  }
}
