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

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    const { data } = await supabase
      .from("card_balances")
      .select("balance_usd_cents")
      .eq("order_id", orderId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      balance_usd_cents: Number(data?.balance_usd_cents || 0)
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Balance fetch failed" },
      { status: 500 }
    );
  }
}
