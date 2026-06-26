"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig
} from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import { sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "Viltrum Card",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
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
  showRecentTransactions={false}
  theme={darkTheme({
    accentColor: "#2E2E33",
    accentColorForeground: "#FFFFFF",
    borderRadius: "large",
    overlayBlur: "small",
    fontStack: "system"
  })}
>
  {children}
</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
