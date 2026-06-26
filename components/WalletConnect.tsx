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
            <button className="wallet-connect-button" disabled>
              Loading…
            </button>
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="wallet-connect-button"
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
              className="wallet-connect-button wallet-connect-warning"
            >
              Wrong Network
            </button>
          );
        }

        return (
          <div className="wallet-connected-row">
            <button
              type="button"
              onClick={openChainModal}
              className="wallet-pill"
            >
              {chain.name}
            </button>

            <button
              type="button"
              onClick={openAccountModal}
              className="wallet-pill wallet-address-pill"
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
