"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";

export default function ManageCardPage() {
  const [secret, setSecret] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  useEffect(() => {
  const user = localStorage.getItem("viltrum_user");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const savedSecret = localStorage.getItem("viltrum_manage_secret");

  if (savedSecret) {
    setSecret(savedSecret);

    fetch("/api/manage-card/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret_code: savedSecret
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        }
      });
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

localStorage.setItem("viltrum_manage_order_id", data.order.id);
localStorage.setItem("viltrum_manage_secret", secret);

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
  {!(isFree && order.status !== "active") && (
    <button onClick={() => setShowDetails(!showDetails)}>
      {showDetails ? "Hide Details" : "Card Details"}
    </button>
  )}

  <button onClick={() => setActiveModal("deposit")}>
    Deposit
  </button>

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("withdraw")}>
      Withdraw
    </button>
  )}

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("balance")}>
      Check Balance
    </button>
  )}

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("transactions")}>
      Transaction History
    </button>
  )}

  {isPhysical && (
    <button onClick={() => setActiveModal("shipment")}>
      Track Shipment
    </button>
  )}

  <button onClick={() => setActiveModal("support")}>
    Help & Support
  </button>
</section>

     {activeModal && (
  <div className="manage-modal-backdrop">
    <div className="manage-modal">
      <button
        className="manage-modal-close"
        onClick={() => setActiveModal("")}
      >
        ×
      </button>

      {activeModal === "deposit" && (
        <>
          <h2>Deposit</h2>
          <p>
            Deposits will connect to your Viltrum vault contract.
          </p>

          {isFree && order.status !== "active" && (
            <div className="manage-modal-note">
              Deposit request received. Please wait up to 2 hours while your
              activation request is verified and processed.
            </div>
          )}

          <button onClick={() => setActiveModal("")}>
            Continue
          </button>
        </>
      )}

      {activeModal === "withdraw" && (
        <>
          <h2>Withdraw</h2>
          <p>
            Withdrawals will connect to your Viltrum vault contract.
          </p>
          <button onClick={() => setActiveModal("")}>
            Continue
          </button>
        </>
      )}

      {activeModal === "balance" && (
        <>
          <h2>Card Balance</h2>
          <p className="manage-modal-balance">$0.00</p>
          <span>Vault contract balance will appear here.</span>
        </>
      )}

      {activeModal === "transactions" && (
        <>
          <h2>Transaction History</h2>
          <div className="manage-tx-empty">
            No transactions yet.
          </div>
        </>
      )}

      {activeModal === "shipment" && (
        <>
          <h2>Shipment Tracking</h2>
          <p>
            <b>Status:</b> {order.shipment_status || "Not started"}
          </p>
          <p>
            {order.tracking_note ||
              "Tracking details will appear here once available."}
          </p>
        </>
      )}

      {activeModal === "support" && (
        <>
          <h2>Help & Support</h2>
          <p>
            For support, contact the Viltrum support team with your Order ID.
          </p>
          <div className="manage-modal-note">
            Order ID: {order.order_id}
          </div>
        </>
      )}
    </div>
  </div>
)}
      
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
