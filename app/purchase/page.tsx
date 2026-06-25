"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";
import {
  CARD_SALE_ADDRESS,
  CARD_SALE_ABI
} from "../../lib/cardSale";

export default function PurchasePage() {
  const [ethUsd, setEthUsd] = useState<number>(0);

  const { data: virtualPrice } = useReadContract({
    address: CARD_SALE_ADDRESS as `0x${string}`,
    abi: CARD_SALE_ABI as any,
    functionName: "virtualPrice"
  });

  const { data: physicalPrice } = useReadContract({
    address: CARD_SALE_ADDRESS as `0x${string}`,
    abi: CARD_SALE_ABI as any,
    functionName: "physicalPrice"
  });

  useEffect(() => {
    const user = localStorage.getItem("viltrum_user");
    const wallet = localStorage.getItem("viltrum_wallet");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!wallet) {
      window.location.href = "/connect-wallet";
    }

    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        setEthUsd(Number(data.ethereum.usd || 0));
      })
      .catch(() => setEthUsd(0));
  }, []);

  function usdPrice(price: any) {
    if (!price || !ethUsd) return "...";

    const eth = Number(formatEther(price as bigint));
    return `$${(eth * ethUsd).toFixed(2)}`;
  }

  return (
    <main className="purchase-premium">
      <HamburgerMenu />
      <WalletBadge />

      <section className="purchase-hero">
        <p className="purchase-label">Viltrum Access Tiers</p>
        <h1>Choose your card</h1>
        <p>
          Select a Viltrum card type to continue. After choosing, you will enter
          your required details and complete the order flow.
        </p>
      </section>

      <section className="purchase-grid">
        <a href="/checkout/virtual" className="purchase-option">
          <div className="purchase-card virtual-card">
            <span>VILTRUM</span>
            <b>Virtual</b>
            <p>4242 4242 4242 1201</p>
          </div>

          <h2>Virtual Card</h2>
          <h3>{usdPrice(virtualPrice)}</h3>
          <p>
            Live contract price:{" "}
            {virtualPrice ? formatEther(virtualPrice as bigint) : "..."} ETH
          </p>
          <button>Purchase Virtual</button>
        </a>

        <a href="/checkout/physical" className="purchase-option featured-option">
          <div className="purchase-card physical-card">
            <span>VILTRUM</span>
            <b>Physical</b>
            <p>4242 4242 4242 6060</p>
          </div>

          <h2>Physical Card</h2>
          <h3>{usdPrice(physicalPrice)}</h3>
          <p>
            Live contract price:{" "}
            {physicalPrice ? formatEther(physicalPrice as bigint) : "..."} ETH
          </p>
          <button>Purchase Physical</button>
        </a>

        <a href="/checkout/free" className="purchase-option">
          <div className="purchase-card free-card">
            <span>VILTRUM</span>
            <b>Free Mint</b>
            <p>4242 4242 4242 0000</p>
          </div>

          <h2>Free Mint</h2>
          <h3>Free</h3>
          <p>
            Includes inactive card and NFT. Activate after minimum reload set by
            admin.
          </p>
          <button>Mint Free</button>
        </a>
      </section>
    </main>
  );
}
