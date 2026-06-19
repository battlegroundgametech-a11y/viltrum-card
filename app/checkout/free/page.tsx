"use client";
import HamburgerMenu from "../../../components/HamburgerMenu";
import WalletBadge from "../../../components/WalletBadge";
import { useState } from "react";

export default function FreeMintPage() {
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

    if (data.success) {
      window.location.href =
        `/success?order=${data.order_id}&secret=${data.secret_code}`;
    }

    setLoading(false);
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />
      <WalletBadge />
      <div className="checkout-card-preview free-preview">
        <span>VILTRUM</span>
        <h2>Free Mint</h2>
        <p>4242 4242 4242 0000</p>
      </div>

      <div className="checkout-form-box">
        <h1>Free Mint</h1>

        <form onSubmit={submitOrder}>
          <input name="full_name" required placeholder="Full Name" />
          <input
            name="telegram_username"
            required
            placeholder="Telegram Username"
          />

          <button>
            {loading ? "Processing..." : "Mint Free Card"}
          </button>
        </form>
      </div>
    </main>
  );
}
