import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const telegramId = body.telegram_id;

  if (!telegramId) {
    return NextResponse.json({ success: false, cards: [] });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("telegram_id", telegramId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message, cards: [] });
  }

  return NextResponse.json({ success: true, cards: data || [] });
}
