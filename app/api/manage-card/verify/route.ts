import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const secretCode = String(
      body.secret_code || ""
    ).trim().toUpperCase();

    if (!secretCode) {
      return NextResponse.json({
        success: false,
        error: "Secret code required"
      });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("secret_code", secretCode)
      .single();

    if (error || !order) {
      return NextResponse.json({
        success: false,
        error: "Invalid secret code"
      });
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Server error"
    });
  }
}
