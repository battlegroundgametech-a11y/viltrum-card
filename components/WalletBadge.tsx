"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export default function WalletBadge() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const addr = address || localStorage.getItem("viltrum_wallet");

    if (addr) {
      setWallet(`${addr.slice(0, 6)}...${addr.slice(-4)}`);
    } else {
      setWallet("");
    }
  }, [address, isConnected]);

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
