"use client";

import { useState } from "react";

export default function PhysicalCheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function submitOrder(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        card_type: "physical",
        full_name: form.get("full_name"),
        telegram_username: form.get("telegram_username"),
        shipping_address: form.get("shipping_address"),
        city: form.get("city"),
        country: form.get("country"),
        coupon_code: form.get("coupon_code")
      })
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      alert(data.error || "Order failed");
      return;
    }

    window.location.href = `/success?order=${data.order_id}&secret=${data.secret_code}`;
  }

  return (
    <main className="v-home min-h-screen px-5 py-24 text-white">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/[0.07] p-8 backdrop-blur-xl">
        <h1 className="text-4xl font-black">Physical Card</h1>
        <p className="mt-3 text-white/60">$60 premium order + $15 bonus + shipment tracking.</p>

        <form onSubmit={submitOrder} className="mt-8 space-y-5">
          <input name="full_name" required placeholder="Full name" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="telegram_username" required placeholder="Telegram username" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="shipping_address" required placeholder="Shipping address" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="city" required placeholder="City" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="country" required placeholder="Country" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="coupon_code" placeholder="Coupon code optional" className="w-full rounded-2xl bg-black/40 p-4" />

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black">
            {loading ? "Processing..." : "Complete Physical Card Order"}
          </button>
        </form>
      </div>
    </main>
  );
}
