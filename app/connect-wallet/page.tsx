"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import WalletConnect from "../../components/WalletConnect";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ConnectWalletPage() {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    async function saveWallet() {
      const telegram_id = localStorage.getItem("viltrum_user");

      if (!telegram_id) {
        window.location.href = "/login";
        return;
      }

      if (isConnected && address) {
        await supabase
          .from("profiles")
          .update({ wallet_address: address })
          .eq("telegram_id", telegram_id);

        localStorage.setItem("viltrum_wallet", address);
        window.location.href = "/purchase";
      }
    }

    saveWallet();
  }, [isConnected, address]);

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview virtual-preview">
        <span>VILTRUM</span>
        <h2>Connect Wallet</h2>
        <p>SEPOLIA • RAINBOWKIT • READY</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Connect Wallet</h1>
        <p className="mt-3 text-white/60">
          Connect your Sepolia wallet to continue to purchase.
        </p>

        <div className="mt-8">
          <WalletConnect />
        </div>
      </div>
    </main>
  );
}
