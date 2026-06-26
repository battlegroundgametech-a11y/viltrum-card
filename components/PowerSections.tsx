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
          NFT VERIFIED • TELEGRAM VERIFIED • SEPOLIA READY • VAULT ENABLED • WALLET CONNECTED • CARD STACK ACTIVE •
        </div>
      </section>

      <section className="power-dashboard">
        <div className="power-copy">
          <p>Live Command Center</p>
          <h2>Everything controlled from one premium vault layer.</h2>
        </div>

        <div className="dash-panel">
          <div className="dash-top">
            <span>Viltrum Vault</span>
            <b>Live</b>
          </div>

          <div className="dash-balance">
            <span>Total Website Volume</span>
            <h3>{stats.totalVolume}</h3>
          </div>

          <div className="dash-chart">
            {stats.chart.map((height, index) => (
              <i
                key={index}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="dash-grid">
            <div><b>{stats.totalMinted}</b><span>Total Orders</span></div>
            <div><b>{stats.physicalOrders}</b><span>Physical Orders</span></div>
            <div><b>{stats.activeCards}</b><span>Active Cards</span></div>
            <div><b>{stats.remainingCards}</b><span>Cards Left</span></div>
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

      <section className="power-prestige">
        <div><b>3</b><span>Card Types</span></div>
        <div><b>$5</b><span>Virtual Entry</span></div>
        <div><b>$15</b><span>Physical Bonus</span></div>
        <div><b>100%</b><span>NFT Proof</span></div>
      </section>
    </>
  );
}
