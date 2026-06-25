"use client";

import HamburgerMenu from "../../../components/HamburgerMenu";
import WalletBadge from "../../../components/WalletBadge";
import { useEffect, useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { FREE_MINT_ADDRESS, FREE_MINT_ABI } from "../../../lib/freeMintContract";
import { useToast } from "../../../components/ToastProvider";

export default function FreeMintPage() {
  const [loading, setLoading] = useState(false);

const { writeContractAsync } = useWriteContract();
const { showToast } = useToast();

const { data: mintEnabled } = useReadContract({
  address: FREE_MINT_ADDRESS as `0x${string}`,
  abi: FREE_MINT_ABI,
  functionName: "freeMintEnabled"
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
    showToast("Please connect wallet first.", "error");
    window.location.href = "/connect-wallet";
    return;
  }

  const form = new FormData(e.target);

  if (!mintEnabled) {
  alert("Free mint is currently disabled.");
  setLoading(false);
  return;
}

try {
  await writeContractAsync({
  address: FREE_MINT_ADDRESS as `0x${string}`,
  abi: FREE_MINT_ABI as any,
  functionName: "freeMint"
} as any);

  showToast("NFT minted successfully.", "success");
} catch (err) {
  console.error(err);

  showToast(
  "Mint failed. You may already have minted or rejected the transaction.",
  "error"
);

  setLoading(false);
  return;
}
    
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      card_type: "free",
      full_name: form.get("full_name"),
      telegram_username: form.get("telegram_username"),
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
  showToast(data.error || "Order failed", "error");
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
