import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  generateOrderId,
  generateSecretCode,
  generateDemoCard
} from "../../../lib/orderHelpers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      card_type,
      full_name,
      telegram_username,
      wallet_address,
      shipping_address,
      city,
      country,
      coupon_code
    } = body;

    if (!card_type || !full_name || !telegram_username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order_id = generateOrderId();
    const secret_code = generateSecretCode();
    const demoCard = generateDemoCard();

    const { error: orderError } = await supabase.from("orders").insert({
      order_id,
      card_type,
      full_name,
      telegram_username,
      wallet_address,
      shipping_address,
      city,
      country,
      coupon_code,
      secret_code,
      status: "pending",
      shipment_status:
        card_type === "physical" ? "Order received" : "Not applicable",
      tracking_note:
        card_type === "physical"
          ? "Shipment tracking will be updated manually after approval."
          : "Tracking is only available for physical card buyers."
    });

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const cardStatus = card_type === "free" ? "inactive" : "pending";

    const { error: cardError } = await supabase.from("cards").insert({
      order_id,
      holder_name: full_name,
      card_number: demoCard.card_number,
      cvv: demoCard.cvv,
      expiry: demoCard.expiry,
      status: cardStatus,
      balance: 0
    });

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_id,
      secret_code
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
