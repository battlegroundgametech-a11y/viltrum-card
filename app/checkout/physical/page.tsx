"use client";

import HamburgerMenu from "../../../components/HamburgerMenu";
import WalletBadge from "../../../components/WalletBadge";
import { useEffect, useState } from "react";

export default function PhysicalCheckoutPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("viltrum_user");
    const wallet = localStorage.getItem("viltrum_wallet");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!wallet) {
      window.location.href = "/connect-wallet";
    }
  }, []);

  async function submitOrder(e: any) {
  e.preventDefault();
  setLoading(true);

  const wallet = localStorage.getItem("viltrum_wallet");
  const telegramId = localStorage.getItem("viltrum_user");

  if (!wallet) {
    alert("Please connect wallet first.");
    window.location.href = "/connect-wallet";
    return;
  }

  const form = new FormData(e.target);

  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      card_type: "physical",
      full_name: form.get("full_name"),
      telegram_username: form.get("telegram_username"),
      shipping_address: form.get("shipping_address"),
      city: form.get("city"),
      country: form.get("country"),
      coupon_code: form.get("coupon_code"),
      wallet_address: wallet,
      telegram_id: telegramId
    })
  });

  const data = await res.json();

  if (data.success) {
  if (Number(data.discount_amount || 0) > 0) {
    alert(
      `Coupon applied successfully.\n\n` +
      `Original Price: $${data.original_price}\n` +
      `Discount: $${data.discount_amount}\n` +
      `Final Price: $${data.final_price}`
    );
  } else {
    alert(
      `Order created successfully.\n\n` +
      `Final Price: $${data.final_price}`
    );
  }

  window.location.href =
    `/success?order=${data.order_id}&secret=${data.secret_code}`;
} else {
  alert(data.error || "Order failed");
}

  setLoading(false);
}

  return (
    <main className="checkout-premium">
      <HamburgerMenu />
      <WalletBadge />

      <div className="checkout-card-preview physical-preview">
        <span>VILTRUM</span>
        <h2>Physical Card</h2>
        <p>4242 4242 4242 6060</p>
      </div>

      <div className="checkout-form-box">
        <h1>Physical Card Purchase</h1>

        <form onSubmit={submitOrder}>
          <input name="full_name" required placeholder="Full Name" />

          <input
            name="telegram_username"
            required
            placeholder="Telegram Username"
          />

          <input
            name="shipping_address"
            required
            placeholder="Shipping Address"
          />

          <input
            name="city"
            required
            placeholder="City"
          />

          <input
            name="country"
            required
            placeholder="Country"
          />

          <input
            name="coupon_code"
            placeholder="Coupon Code (Optional)"
          />

          <button>
            {loading ? "Processing..." : "Purchase Physical Card"}
          </button>
        </form>
      </div>
    </main>
  );
}
