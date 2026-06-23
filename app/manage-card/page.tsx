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

  function depositAction() {
    if (order?.card_type === "free" && order?.status !== "active") {
      alert(
        "Deposit request received.\n\nPlease wait up to 2 hours while your activation request is verified and processed."
      );
      return;
    }

    alert("Deposit will connect to your vault contract.");
  }

  if (!order) {
    return (
      <main className="manage-page">
        <HamburgerMenu />

        <div className="manage-unlock">
          <div className="manage-unlock-card">
            <p className="manage-eyebrow">Viltrum Secure Access</p>
            <h1>Manage My Card</h1>
            <p>
              Enter your secret code to unlock your private card dashboard.
            </p>

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
        </div>
      </main>
    );
  }

  const isFree = order.card_type === "free";
  const isPhysical = order.card_type === "physical";
  const isVirtual = order.card_type === "virtual";
  const isInactiveFree = isFree && order.status !== "active";

  const maskedNumber =
    "**** **** **** " + String(order.card_number || "0000").slice(-4);

  return (
    <main className="manage-page">
      <HamburgerMenu />
      <WalletBadge />

      <section className="manage-header">
        <p>Viltrum Banking Console</p>
        <h1>Manage My Card</h1>
        <span>Private card controls secured by your secret code.</span>
      </section>

      <section className="manage-bank-layout">
        <div className="manage-card-panel">
          <div
            className={`manage-card ${
              isInactiveFree ? "manage-card-blur" : ""
            }`}
          >
            <div className="manage-card-top">
              <span>VILTRUM</span>
              <small>{order.status || "active"}</small>
            </div>

            <h2>
              {isVirtual && "Virtual Card"}
              {isPhysical && "Physical Card"}
              {isFree && "Free Mint Card"}
            </h2>

            <p className="manage-card-number">
              {showDetails && order.card_number
                ? order.card_number
                : maskedNumber}
            </p>

            <div className="manage-card-bottom">
              <b>{order.full_name || "Card Holder"}</b>
              <b>
                {showDetails && order.card_exp ? order.card_exp : "**/**"}
              </b>
            </div>

            {isInactiveFree && (
              <div className="inactive-card-label">
                INACTIVE
              </div>
            )}
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
                  : "Your physical card request has been submitted."}
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
                  ? "Your free mint card is active and ready."
                  : "Deposit the minimum required balance to activate this card."}
              </p>
            </div>
          )}
        </div>

        <div className="manage-money-panel">
          <p>Current Balance</p>
          <h2>$0.00</h2>
          <span>Vault contract balance will appear here.</span>

          <div className="manage-mini-stats">
            <div>
              <small>Total Deposits</small>
              <b>$0.00</b>
            </div>

            <div>
              <small>Total Withdrawals</small>
              <b>$0.00</b>
            </div>
          </div>
        </div>
      </section>

      <section className="manage-actions">
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Card Details"}
        </button>

        <button onClick={depositAction}>
          Deposit
        </button>

        <button onClick={() => alert("Withdraw will connect to your vault contract.")}>
          Withdraw
        </button>

        <button onClick={() => alert("Balance: $0.00")}>
          Check Balance
        </button>

        <button onClick={() => alert("Transaction history will be shown here.")}>
          Transaction History
        </button>

        <button onClick={() => alert("Support system will be added here.")}>
          Help & Support
        </button>
      </section>

      {showDetails && (
        <section className="manage-details">
          <h2>Card Details</h2>

          <div className="manage-detail-grid">
            <p>
              <span>Card Number</span>
              <b>{order.card_number || "Not assigned"}</b>
            </p>

            <p>
              <span>Expiry</span>
              <b>{order.card_exp || "Not assigned"}</b>
            </p>

            <p>
              <span>CVV</span>
              <b>{order.card_cvv || "***"}</b>
            </p>

            <p>
              <span>Status</span>
              <b>{order.status}</b>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
