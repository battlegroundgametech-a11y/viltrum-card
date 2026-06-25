"use client";

import { useEffect } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";

export default function PurchasePage() {
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
  }, []);

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
          <h3>$5</h3>
          <p>
            Includes virtual card, NFT access, and instant digital card
            assignment after purchase.
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
          <h3>$60</h3>
          <p>
            Includes physical card request, virtual access, NFT access, manual
            approval, and shipment tracking.
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
