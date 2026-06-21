"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export default function WalletBadge() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("viltrum_user");
    const savedWallet = localStorage.getItem("viltrum_wallet");

    if (!user || !savedWallet) {
      setWallet("");
      return;
    }

    setWallet(`${savedWallet.slice(0, 6)}...${savedWallet.slice(-4)}`);
  }, [address]);

  if (!wallet) return null;

  return (
    <div className="wallet-badge">
      <span>{wallet}</span>

      <button
        onClick={() => {
          disconnect();
          localStorage.removeItem("viltrum_wallet");
          window.location.href = "/connect-wallet";
        }}
        className="wallet-disconnect"
      >
        Disconnect
      </button>
    </div>
  );
}
