"use client";

import { useState } from "react";

export default function VirtualCheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function submitOrder(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        card_type: "virtual",
        full_name: form.get("full_name"),
        telegram_username: form.get("telegram_username"),
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
        <h1 className="text-4xl font-black">Virtual Card</h1>
        <p className="mt-3 text-white/60">$5 demo card + NFT. First 1000 buyers get $5 bonus.</p>

        <form onSubmit={submitOrder} className="mt-8 space-y-5">
          <input name="full_name" required placeholder="Full name" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="telegram_username" required placeholder="Telegram username" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="coupon_code" placeholder="Coupon code optional" className="w-full rounded-2xl bg-black/40 p-4" />

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black">
            {loading ? "Processing..." : "Complete Virtual Card Order"}
          </button>
        </form>
      </div>
    </main>
  );
}
