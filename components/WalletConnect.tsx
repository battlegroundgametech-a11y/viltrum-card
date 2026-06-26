"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnect() {
  return (
    <div className="official-rainbow-wallet">
      <ConnectButton label="Connect Wallet" showBalance={false} />
    </div>
  );
}
