"use client";

import { useAccount } from "wagmi";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import WalletConnect from "../../components/WalletConnect";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ConnectWalletPage() {
  const { isConnected, address } = useAccount();

  const [hasOrders, setHasOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const savingRef = useRef(false);

  useEffect(() => {
    const telegram_id = localStorage.getItem("viltrum_user");

    if (!telegram_id) {
      window.location.href = "/login";
      return;
    }

    async function checkOldOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("telegram_id", telegram_id)
        .limit(1);

      if (!error) {
        setHasOrders(!!data && data.length > 0);
      }
    }

    checkOldOrders();
  }, []);

  async function saveWallet(): Promise<boolean> {
    if (savingRef.current) return false;

    setError("");

    const telegram_id = localStorage.getItem("viltrum_user");

    if (!telegram_id) {
      window.location.href = "/login";
      return false;
    }

    if (!isConnected || !address) {
      setError("Connect your wallet first.");
      return false;
    }

    savingRef.current = true;
    setIsSaving(true);

    const { data, error } = await supabase
      .from("profiles")
      .update({ wallet_address: address.toLowerCase() })
      .eq("telegram_id", telegram_id)
      .select("telegram_id")
      .single();

    savingRef.current = false;
    setIsSaving(false);

    if (error || !data) {
      setError("Wallet could not be saved. Try again.");
      return false;
    }

    localStorage.setItem("viltrum_wallet", address.toLowerCase());
    return true;
  }

  async function useWallet() {
    const saved = await saveWallet();
    if (saved) window.location.href = "/purchase";
  }

  async function manageCards() {
    const saved = await saveWallet();
    if (saved) window.location.href = "/manage-card";
  }

  return (
    <main className="wallet-page">
      <HamburgerMenu />

      <section className="wallet-shell" aria-labelledby="wallet-title">
        <div className="wallet-hero">
          <div className="wallet-kicker">Sepolia Wallet Access</div>

          <h1 id="wallet-title">Connect your wallet</h1>

          <p>Securely link your wallet to continue.</p>
        </div>

        <div className="wallet-panel">
          <div className="wallet-panel-header">
            <div>
              <span>Wallet</span>
              <h2>Choose connection</h2>
            </div>

            <div className={isConnected ? "wallet-status active" : "wallet-status"}>
              {isConnected ? "Connected" : "Required"}
            </div>
          </div>

          <WalletConnect />

          {error && (
            <p className="wallet-error" role="alert">
              {error}
            </p>
          )}

          {isConnected && address && (
            <div className="wallet-actions">
              <button
                type="button"
                onClick={useWallet}
                disabled={isSaving}
                className="wallet-primary-action"
              >
                {isSaving ? "Saving…" : "Use Wallet"}
              </button>

              {hasOrders && (
                <button
                  type="button"
                  onClick={manageCards}
                  disabled={isSaving}
                  className="wallet-secondary-action"
                >
                  Manage Cards
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
