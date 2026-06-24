"use client";

import HamburgerMenu from "../../../components/HamburgerMenu";
import WalletBadge from "../../../components/WalletBadge";
import { useEffect, useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { parseEther } from "viem";
import {
  CARD_SALE_ADDRESS,
  CARD_SALE_ABI
} from "../../../lib/cardSale";

export default function PhysicalCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const { writeContractAsync } = useWriteContract<any>();
  const { data: physicalPrice } = useReadContract({
  address: CARD_SALE_ADDRESS as `0x${string}`,
  abi: CARD_SALE_ABI as any,
  functionName: "physicalPrice"
});

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
    const couponCode = String(form.get("coupon_code") || "");

    try {
      await writeContractAsync({
        address: CARD_SALE_ADDRESS as `0x${string}`,
        abi: CARD_SALE_ABI as any,
        functionName: "purchasePhysical",
        args: [1, couponCode],
        value: physicalPrice as bigint
      } as any);
    } catch (err: any) {
      alert(err?.shortMessage || err?.message || "Payment failed");
      setLoading(false);
      return;
    }

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
        coupon_code: couponCode,
        wallet_address: wallet,
        telegram_id: telegramId
      })
    });

    const data = await res.json();

    if (data.success) {
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

<p className="checkout-price">
  Price: {physicalPrice ? formatEther(physicalPrice as bigint) : "0"} ETH
</p>

        <form onSubmit={submitOrder}>
          <input name="full_name" required placeholder="Full Name" />
          <input name="telegram_username" required placeholder="Telegram Username" />
          <input name="shipping_address" required placeholder="Shipping Address" />
          <input name="city" required placeholder="City" />
          <input name="country" required placeholder="Country" />
          <input name="coupon_code" placeholder="Coupon Code (Optional)" />

          <button>
            {loading ? "Processing..." : "Purchase Physical Card"}
          </button>
        </form>
      </div>
    </main>
  );
}
