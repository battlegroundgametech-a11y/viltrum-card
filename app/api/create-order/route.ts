import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeSecretCode() {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const part3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VT-${part1}-${part2}-${part3}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const secretCode = makeSecretCode();
    const orderId = `ORDER-${Date.now()}`;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        profile_id: body.profile_id || null,
        telegram_id: body.telegram_id || null,
        wallet_address: body.wallet_address || "",
        card_type: body.card_type,
        full_name: body.full_name || "",
        telegram_username: body.telegram_username || "",
        shipping_address: body.shipping_address || "",
        city: body.city || "",
        country: body.country || "",
        coupon_code: body.coupon_code || "",
        secret_code: secretCode,
        status: "pending",
        shipment_status: "not_started",
        tracking_note: ""
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 400 }
      );
    }

    const { error: codeError } = await supabase.from("access_codes").insert({
      code: secretCode,
      order_id: order.id,
      telegram_id: body.telegram_id || null,
      card_type: body.card_type,
      used: false
    });

    if (codeError) {
      return NextResponse.json(
        { success: false, error: codeError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      secret_code: secretCode
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
