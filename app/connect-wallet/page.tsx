"use client";

import HamburgerMenu from "@/components/HamburgerMenu";

export default function ConnectWalletPage() {
  return (
    <main className="viltrum-gradient flex min-h-screen items-center justify-center px-5">
      <HamburgerMenu />

      <div className="viltrum-glass max-w-lg rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-black">Telegram Connected</h1>

        <p className="mt-4 text-white/70">
          Your Telegram account was connected successfully.
        </p>

        <p className="mt-2 text-white/50">
          Next, connect your crypto wallet on Sepolia.
        </p>

        <a
          href="/purchase"
          className="mt-8 inline-block rounded-2xl bg-viltrumPurple px-8 py-4 font-bold"
        >
          Continue to Purchase Options
        </a>
      </div>
    </main>
  );
}
