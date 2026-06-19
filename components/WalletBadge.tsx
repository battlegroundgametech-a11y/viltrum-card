"use client";

import { useEffect, useState } from "react";

export default function WalletBadge() {
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const addr = localStorage.getItem("viltrum_wallet");

    if (addr) {
      setWallet(
        `${addr.slice(0, 6)}...${addr.slice(-4)}`
      );
    }
  }, []);

  if (!wallet) return null;

  return (
    <div className="wallet-badge">
      {wallet}
    </div>
  );
}
