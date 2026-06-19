"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";

import WalletConnect from "../../components/WalletConnect";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ConnectWalletPage() {
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      window.location.href = "/purchase";
    }
  }, [isConnected]);

  return (
    <main className="viltrum-gradient flex min-h-screen items-center justify-center px-5">
      <HamburgerMenu />

      <div className="viltrum-glass max-w-xl rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-black">
          Connect Wallet
        </h1>

        <p className="mt-4 text-white/70">
          Connect your Sepolia wallet to continue.
        </p>

        <div className="mt-8">
          <WalletConnect />
        </div>
      </div>
    </main>
  );
}
