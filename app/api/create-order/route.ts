import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeSecretCode() {
  const a = Math.random().toString(36).substring(2, 6).toUpperCase();
  const b = Math.random().toString(36).substring(2, 6).toUpperCase();
  const c = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VT-${a}-${b}-${c}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cardType = String(body.card_type || "").toLowerCase();
    const wallet = String(body.wallet_address || "").toLowerCase();
    const couponCode = String(body.coupon_code || "").trim().toUpperCase();

    if (!["virtual", "physical", "free"].includes(cardType)) {
      return NextResponse.json({ success: false, error: "Invalid card type" }, { status: 400 });
    }

    if (!wallet) {
      return NextResponse.json({ success: false, error: "Wallet not connected" }, { status: 400 });
    }

    const [{ data: settings }, { data: pricing }, { data: limits }, { data: inventory }] =
      await Promise.all([
        supabase.from("platform_settings").select("*").eq("id", 1).single(),
        supabase.from("pricing").select("*").eq("id", 1).single(),
        supabase.from("purchase_limits").select("*").eq("id", 1).single(),
        supabase.from("card_inventory").select("*").eq("id", 1).single()
      ]);

    if (!settings || !pricing || !limits || !inventory) {
      return NextResponse.json({ success: false, error: "Platform settings missing" }, { status: 400 });
    }

    const priceMap: any = {
      virtual: Number(pricing.virtual_price),
      physical: Number(pricing.physical_price),
      free: Number(pricing.free_price)
    };

    const supplyMap: any = {
      virtual: Number(inventory.virtual_supply),
      physical: Number(inventory.physical_supply),
      free: Number(inventory.free_supply)
    };

    const limitMap: any = {
      virtual: Number(limits.virtual_limit_per_wallet),
      physical: Number(limits.physical_limit_per_wallet),
      free: Number(limits.free_limit_per_wallet)
    };

    if (supplyMap[cardType] <= 0) {
      return NextResponse.json({ success: false, error: "This card type is sold out" }, { status: 400 });
    }

    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("wallet_address", wallet)
      .eq("card_type", cardType);

    if ((count || 0) >= limitMap[cardType]) {
      return NextResponse.json(
        { success: false, error: `Wallet limit reached for ${cardType} card` },
        { status: 400 }
      );
    }

    let originalPrice = priceMap[cardType];
    let discountAmount = 0;
    let finalPrice = originalPrice;
    let appliedCouponId: string | null = null;

    if (couponCode && cardType !== "free") {
      const { data: coupon } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("code", couponCode)
        .eq("active", true)
        .maybeSingle();

      if (!coupon) {
        return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: "Coupon expired" }, { status: 400 });
      }

      if (Number(coupon.used_count) >= Number(coupon.max_uses)) {
        return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
      }

      if (cardType === "virtual" && !coupon.applies_virtual) {
        return NextResponse.json({ success: false, error: "Coupon not valid for virtual card" }, { status: 400 });
      }

      if (cardType === "physical" && !coupon.applies_physical) {
        return NextResponse.json({ success: false, error: "Coupon not valid for physical card" }, { status: 400 });
      }

      if (coupon.discount_type === "percent") {
        discountAmount = originalPrice * (Number(coupon.discount_value) / 100);
      } else {
        discountAmount = Number(coupon.discount_value);
      }

      if (discountAmount > originalPrice) discountAmount = originalPrice;

      finalPrice = originalPrice - discountAmount;
      appliedCouponId = coupon.id;
    }

    const secretCode = makeSecretCode();
    const orderId = `ORDER-${Date.now()}`;

    const status = cardType === "free" ? "inactive" : "active";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: orderId,
        profile_id: body.profile_id || null,
        telegram_id: body.telegram_id || null,
        wallet_address: wallet,
        card_type: cardType,
        full_name: body.full_name || "",
        telegram_username: body.telegram_username || "",
        shipping_address: body.shipping_address || "",
        city: body.city || "",
        country: body.country || "",
        coupon_code: couponCode || "",
        secret_code: secretCode,
        status,
        shipment_status: "not_started",
        tracking_note: ""
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, error: orderError.message }, { status: 400 });
    }

    await supabase.from("access_codes").insert({
      code: secretCode,
      order_id: order.id,
      telegram_id: body.telegram_id || null,
      card_type: cardType,
      used: false
    });

    const updateInventory: any = {};

    if (cardType === "virtual") updateInventory.virtual_supply = supplyMap.virtual - 1;
    if (cardType === "physical") updateInventory.physical_supply = supplyMap.physical - 1;
    if (cardType === "free") updateInventory.free_supply = supplyMap.free - 1;

    await supabase
      .from("card_inventory")
      .update(updateInventory)
      .eq("id", 1);

    if (appliedCouponId) {
      const { data: couponNow } = await supabase
        .from("coupon_codes")
        .select("used_count")
        .eq("id", appliedCouponId)
        .single();

      await supabase
        .from("coupon_codes")
        .update({ used_count: Number(couponNow?.used_count || 0) + 1 })
        .eq("id", appliedCouponId);
    }

    await supabase.from("card_transactions").insert({
      order_id: orderId,
      wallet_address: wallet,
      transaction_type: "purchase",
      amount: finalPrice,
      balance_after: 0,
      tx_hash: body.tx_hash || ""
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      display_order_id: orderId,
      secret_code: secretCode,
      original_price: originalPrice,
      discount_amount: discountAmount,
      final_price: finalPrice,
      status
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
