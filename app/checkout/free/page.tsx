"use client";

import { useState } from "react";

export default function FreeCheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function submitOrder(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({
        card_type: "free",
        full_name: form.get("full_name"),
        telegram_username: form.get("telegram_username")
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
        <h1 className="text-4xl font-black">Free Mint</h1>
        <p className="mt-3 text-white/60">Free inactive card + NFT. Activate after minimum reload.</p>

        <form onSubmit={submitOrder} className="mt-8 space-y-5">
          <input name="full_name" required placeholder="Full name" className="w-full rounded-2xl bg-black/40 p-4" />
          <input name="telegram_username" required placeholder="Telegram username" className="w-full rounded-2xl bg-black/40 p-4" />

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black">
            {loading ? "Processing..." : "Complete Free Mint"}
          </button>
        </form>
      </div>
    </main>
  );
}
