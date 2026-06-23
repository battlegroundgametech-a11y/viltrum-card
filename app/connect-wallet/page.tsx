"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import WalletConnect from "../../components/WalletConnect";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ConnectWalletPage() {
  const { isConnected, address } = useAccount();
  const [hasOrders, setHasOrders] = useState(false);

  useEffect(() => {
    const telegram_id = localStorage.getItem("viltrum_user");

    if (!telegram_id) {
      window.location.href = "/login";
      return;
    }

    async function checkOldOrders() {
      const { data } = await supabase
        .from("orders")
        .select("id")
        .eq("telegram_id", telegram_id)
        .limit(1);

      setHasOrders(!!data && data.length > 0);
    }

    checkOldOrders();
  }, []);

  async function saveWallet() {
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
  }

  async function useWallet() {
    await saveWallet();
    window.location.href = "/purchase";
  }

  async function manageCards() {
    await saveWallet();
    window.location.href = "/manage-card";
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
          Connect your wallet, then choose what you want to do.
        </p>

        <div className="mt-8">
          <WalletConnect />
        </div>

        {isConnected && address && (
          <div className="mt-6 flex flex-col gap-4">
            <button onClick={useWallet}>
              Use Wallet
            </button>

            {hasOrders && (
              <button onClick={manageCards}>
                Manage Cards
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
