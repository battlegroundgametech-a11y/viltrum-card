import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      body.password !==
      process.env.ADMIN_PANEL_PASSWORD
    ) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized"
      });
    }

    const orderId = body.orderId;
    const action = body.action;

    let updateData: any = {};

    if (action === "approve") {
      updateData.status = "active";
    }

    if (action === "reject") {
      updateData.status = "rejected";
    }

    if (action === "card_printing") {
  updateData.shipment_status = "card_printing";
  updateData.tracking_note =
    "Your physical card is being printed and prepared.";
}

if (action === "quality_check") {
  updateData.shipment_status = "quality_check";
  updateData.tracking_note =
    "Your card has entered final quality verification.";
}

if (action === "packaging") {
  updateData.shipment_status = "packaging";
  updateData.tracking_note =
    "Your card is being packed securely for shipment.";
}

if (action === "processing") {
  updateData.shipment_status = "processing";
  updateData.tracking_note =
    "Your shipment is being prepared.";
}

if (action === "dispatched") {
  updateData.shipment_status = "dispatched";
  updateData.tracking_note =
    "Your card has been dispatched from our facility.";
}

if (action === "in_transit") {
  updateData.shipment_status = "in_transit";
  updateData.tracking_note =
    "Your card is in transit.";
}

if (action === "out_for_delivery") {
  updateData.shipment_status = "out_for_delivery";
  updateData.tracking_note =
    "Your card is out for delivery.";
}

if (action === "delivered") {
  updateData.shipment_status = "delivered";
  updateData.tracking_note =
    "Your card has been delivered.";
}

if (action === "delivery_failed") {
  updateData.shipment_status = "delivery_failed";
  updateData.tracking_note =
    "Delivery failed. Support will contact you for the next steps.";
}

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }

    return NextResponse.json({
      success: true
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}
