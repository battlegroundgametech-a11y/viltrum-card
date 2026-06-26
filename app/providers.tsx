"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme
} from "@rainbow-me/rainbowkit";

import {
  rainbowWallet,
  metaMaskWallet,
  base,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";

import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        base,
        walletConnectWallet
      ]
    }
  ],
  {
    appName: "Viltrum Card",
    projectId
  }
);

const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http()
  },
  ssr: true
});

const queryClient = new QueryClient();

export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#3898ff",
            accentColorForeground: "white",
            borderRadius: "large"
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
