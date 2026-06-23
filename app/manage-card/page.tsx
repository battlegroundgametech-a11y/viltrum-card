"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";

export default function ManageCardPage() {
  const [secret, setSecret] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("viltrum_user");

    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  async function unlockCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/manage-card/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret_code: secret
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Invalid secret code");
      setLoading(false);
      return;
    }

    setOrder(data.order);
    setLoading(false);
  }

  if (!order) {
    return (
      <main className="manage-page">
        <HamburgerMenu />

        <div className="manage-unlock">
          <h1>Manage My Card</h1>
          <p>Enter your secret code to unlock your card dashboard.</p>

          <form onSubmit={unlockCard}>
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter Secret Code"
              required
            />

            <button disabled={loading}>
              {loading ? "Checking..." : "Unlock Card"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const isFree = order.card_type === "free";
  const isPhysical = order.card_type === "physical";
  const isVirtual = order.card_type === "virtual";

  return (
    <main className="manage-page">
      <HamburgerMenu />
      <WalletBadge />

      <section className="manage-header">
        <p>Viltrum Banking Console</p>
        <h1>Manage My Card</h1>
      </section>

      <section className="manage-card-wrap">
        <div
          className={`manage-card ${
            isFree ? "manage-card-blur" : ""
          }`}
        >
          <span>VILTRUM</span>

          <h2>
            {isVirtual && "Virtual Card"}
            {isPhysical && "Physical Card"}
            {isFree && "Free Mint Card"}
          </h2>

          <p className="manage-card-number">
            {showDetails && order.card_number
              ? order.card_number
              : "**** **** **** " +
                String(order.card_number || "0000").slice(-4)}
          </p>

          <div className="manage-card-bottom">
            <b>{order.full_name || "Card Holder"}</b>
            <b>
              {showDetails && order.card_exp
                ? order.card_exp
                : "**/**"}
            </b>
          </div>
        </div>

        {isPhysical && (
          <div className="manage-status-box">
            <h2>
              {order.status === "active"
                ? "Card Approved"
                : "Card Request Submitted"}
            </h2>
            <p>
              {order.status === "active"
                ? "Dispatching soon."
                : "Your physical card request is being processed."}
            </p>
          </div>
        )}

        {isFree && (
          <div className="manage-status-box">
            <h2>
              {order.status === "active"
                ? "Free Card Active"
                : "Card Inactive"}
            </h2>
            <p>
              {order.status === "active"
                ? "Your free mint card is active."
                : "Deposit the minimum required balance to activate this card."}
            </p>
          </div>
        )}
      </section>

      <section className="manage-actions">
        <button onClick={() => setShowDetails(!showDetails)}>
          Card Details
        </button>

        <button
          onClick={() =>
            alert("Deposit will connect to your vault contract.")
          }
        >
          Deposit
        </button>

        <button
          onClick={() =>
            alert("Withdraw will connect to your vault contract.")
          }
        >
          Withdraw
        </button>

        <button onClick={() => alert("Balance: $0.00")}>
          Check Balance
        </button>

        <button
          onClick={() =>
            alert("Transaction history will be shown here.")
          }
        >
          Transaction History
        </button>

        <button
          onClick={() =>
            alert("Support system will be added here.")
          }
        >
          Help & Support
        </button>
      </section>

      {showDetails && (
        <section className="manage-details">
          <h2>Card Details</h2>
          <p>Card Number: {order.card_number || "Not assigned"}</p>
          <p>Expiry: {order.card_exp || "Not assigned"}</p>
          <p>CVV: {order.card_cvv || "***"}</p>
          <p>Status: {order.status}</p>
        </section>
      )}
    </main>
  );
}
