"use client";

import { useEffect, useState } from "react";

type VaultStats = {
  totalVolume: string;
  totalMinted: string;
  physicalOrders: string;
  activeCards: string;
  remainingCards: string;
  chart: number[];
};

const defaultStats: VaultStats = {
  totalVolume: "$0.00",
  totalMinted: "0",
  physicalOrders: "0",
  activeCards: "0",
  remainingCards: "0",
  chart: [18, 18, 18, 18, 18, 18, 18]
};

export default function PowerSections() {
  const [stats, setStats] = useState<VaultStats>(defaultStats);

  async function loadVaultStats() {
    try {
      const res = await fetch("/api/homepage/vault-stats", {
        cache: "no-store"
      });

      const data = await res.json();

      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch {
      setStats(defaultStats);
    }
  }

  useEffect(() => {
    loadVaultStats();

    const interval = setInterval(loadVaultStats, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="power-ticker">
        <div>
          NO KYC • TELEGRAM VERIFIED • SEPOLIA READY • VAULT ENABLED • WALLET CONNECTED • CARD STACK ACTIVE •
        </div>
      </section>

      <section className="extra-showcase premium-device-section">
  <div className="device-copy">
    <h2>Crypto cards built for a premium wallet experience</h2>
    <p>
      A modern card interface designed for virtual access, future physical
      delivery, Tracking, vault controls, reloads, withdrawals, and NFT
      ownership proof.
    </p>

    <div className="device-points">
      <span>No KYC</span>
      <span>Vault controls</span>
      <span>Fully Secured</span>
    </div>
  </div>

  <div className="device-scene">
    <div className="floating-card card-front">
      <span>VILTRUM</span>
      <b>Sovereign Black</b>
    </div>

    <div className="floating-card card-back">
      <div className="mag-strip" />
      <span>VAULT READY</span>
    </div>

    <div className="floating-card card-gold-side">
      <span>NO KYC</span>
    </div>
  </div>
</section>

      <section className="power-flow">
        <p>How It Works</p>
        <h2>From verification to card ownership</h2>

        <div className="flow-line">
          {["Telegram Login", "Wallet Connect", "Choose Card", "Mint NFT", "Bot Verification", "Vault Control"].map((item, i) => (
            <div className="flow-step" key={item}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
