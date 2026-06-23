import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const orderId =
    req.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({
      success: false
    });
  }

  const { data, error } = await supabase
    .from("card_transactions")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }

  return NextResponse.json({
    success: true,
    transactions: data || []
  });
}
