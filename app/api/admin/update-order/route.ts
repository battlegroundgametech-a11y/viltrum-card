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

    if (action === "processing") {
      updateData.shipment_status = "processing";
      updateData.tracking_note =
        "Your shipment is being prepared.";
    }

    if (action === "shipped") {
      updateData.shipment_status = "shipped";
      updateData.tracking_note =
        "Your card has been shipped.";
    }

    if (action === "delivered") {
      updateData.shipment_status = "delivered";
      updateData.tracking_note =
        "Your card has been delivered.";
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
