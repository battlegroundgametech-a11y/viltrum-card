"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          return (
            <button className="light-wallet-btn" disabled>
              Loading…
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="light-wallet-btn"
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className="light-wallet-btn wallet-warning"
            >
              Wrong Network
            </button>
          );
        }

        return (
          <div className="light-wallet-connected">
            <button
              type="button"
              onClick={openChainModal}
              className="light-wallet-chip"
            >
              {chain.name}
            </button>

            <button
              type="button"
              onClick={openAccountModal}
              className="light-wallet-chip address"
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
