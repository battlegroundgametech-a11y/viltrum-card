"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import WalletConnect from "../../components/WalletConnect";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ConnectWalletPage() {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    const telegram_id = localStorage.getItem("viltrum_user");

    if (!telegram_id) {
      window.location.href = "/login";
    }
  }, []);

  async function useWallet() {
    const telegram_id = localStorage.getItem("viltrum_user");

    if (!telegram_id) {
      window.location.href = "/login";
      return;
    }

    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    await supabase
      .from("profiles")
      .update({ wallet_address: address })
      .eq("telegram_id", telegram_id);

    localStorage.setItem("viltrum_wallet", address);
    window.location.href = "/purchase";
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview virtual-preview">
        <span>VILTRUM</span>
        <h2>Connect Wallet</h2>
        <p>SEPOLIA • WALLET • READY</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Connect Wallet</h1>

        <p className="mt-3 text-white/60">
          Connect your wallet, then confirm it manually.
        </p>

        <div className="mt-8">
          <WalletConnect />
        </div>

        {isConnected && address && (
          <button onClick={useWallet} className="mt-6">
            Use This Wallet
          </button>
        )}
      </div>
    </main>
  );
}
