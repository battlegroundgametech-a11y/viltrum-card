"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  async function loadOrders(pass = password) {
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Wrong password");
      return;
    }

    localStorage.setItem("viltrum_admin_password", pass);
    setOrders(data.orders || []);
    setAuthorized(true);
  }

  async function login() {
    loadOrders(password);
  }

  async function updateOrder(id: string, action: string) {
    const saved = localStorage.getItem("viltrum_admin_password") || "";

    const res = await fetch("/api/admin/update-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: saved,
        orderId: id,
        action
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Update failed");
      return;
    }

    loadOrders(saved);
  }

  useEffect(() => {
    const saved = localStorage.getItem("viltrum_admin_password");
    if (saved) {
      setPassword(saved);
      loadOrders(saved);
    }
  }, []);

  const pendingPhysical = orders.filter(
    (o) => o.status === "pending_physical_approval"
  );

  const pendingFree = orders.filter(
    (o) => o.status === "pending_free_approval"
  );

  const active = orders.filter((o) => o.status === "active");
  const rejected = orders.filter((o) => o.status === "rejected");

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "physical") return o.card_type === "physical";
    if (filter === "free") return o.card_type === "free";
    if (filter === "pending") {
      return (
        o.status === "pending_physical_approval" ||
        o.status === "pending_free_approval"
      );
    }
    if (filter === "active") return o.status === "active";
    if (filter === "rejected") return o.status === "rejected";
    return true;
  });

  if (!authorized) {
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <p>Viltrum Secure Console</p>
          <h1>Admin Login</h1>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Enter Admin Panel</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-topbar">
        <div>
          <p>Viltrum Control Center</p>
          <h1>Admin Dashboard</h1>
        </div>

        <div className="admin-top-actions">
          <button onClick={() => loadOrders()}>Refresh</button>

          <button
            onClick={() => {
              localStorage.removeItem("viltrum_admin_password");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      </section>

      <section className="admin-stats">
  <div>
    <span>Pending Physical</span>
    <b>{pendingPhysical.length}</b>
  </div>

  <div>
    <span>Pending Free</span>
    <b>{pendingFree.length}</b>
  </div>

  <div>
    <span>Active Cards</span>
    <b>{active.length}</b>
  </div>

  <div>
    <span>Rejected</span>
    <b>{rejected.length}</b>
  </div>
</section>

<section className="admin-actions-panel">
  <button
    onClick={() =>
      pendingPhysical.forEach((o) =>
        updateOrder(o.id, "approve")
      )
    }
  >
    Approve All Physical
  </button>

  <button
    onClick={() =>
      pendingFree.forEach((o) =>
        updateOrder(o.id, "approve")
      )
    }
  >
    Approve All Free
  </button>
</section>

<section className="admin-tabs">
  {[
    "all",
    "pending",
    "physical",
    "free",
    "active",
    "rejected"
  ].map((item) => (
    <button
      key={item}
      onClick={() => setFilter(item)}
      className={filter === item ? "active" : ""}
    >
      {item}
    </button>
  ))}
</section>

<section className="admin-orders-grid">
  {filteredOrders.map((order) => (
    <div
      key={order.id}
      className="admin-order-card"
    >
      <div className="admin-order-head">
        <div>
          <span>{order.card_type}</span>
          <h2>{order.order_id}</h2>
        </div>

        <b
          className={`admin-status ${order.status}`}
        >
          {order.status}
        </b>
      </div>

      <div className="admin-order-info">
        <p>
          <span>Name</span>
          <b>{order.full_name || "Not provided"}</b>
        </p>

        <p>
          <span>Wallet</span>
          <b>
            {order.wallet_address
              ? `${order.wallet_address.slice(
                  0,
                  6
                )}...${order.wallet_address.slice(-4)}`
              : "No wallet"}
          </b>
        </p>

        <p>
          <span>Shipment</span>
          <b>
            {order.shipment_status ||
              "not_started"}
          </b>
        </p>

        <p>
          <span>Created</span>
          <b>
            {order.created_at
              ? new Date(
                  order.created_at
                ).toLocaleDateString()
              : "-"}
          </b>
        </p>

        {order.card_type === "free" && (
  <>
    <p>
      <span>Min Deposit</span>
      <b>
        {order.free_min_deposit_done
          ? "Done"
          : "Not Done"}
      </b>
    </p>

    <p>
      <span>Deposited</span>
      <b>
        {order.free_current_deposit || "0"} ETH
      </b>
    </p>

    <p>
      <span>Required</span>
      <b>
        {order.free_required_deposit || "-"} ETH
      </b>
    </p>
  </>
)}
      </div>

      <div className="admin-button-row">
        <button
          onClick={() =>
            updateOrder(order.id, "approve")
          }
        >
          Approve
        </button>

        <button
          className="danger"
          onClick={() =>
            updateOrder(order.id, "reject")
          }
        >
          Reject
        </button>
      </div>

      {order.card_type === "physical" && (
        <div className="admin-shipment-actions">
          <button
            onClick={() =>
              updateOrder(
                order.id,
                "processing"
              )
            }
          >
            Processing
          </button>

          <button onClick={() => updateOrder(order.id, "card_printing")}>
  Card Printing
</button>

<button onClick={() => updateOrder(order.id, "quality_check")}>
  Quality Check
</button>

<button onClick={() => updateOrder(order.id, "packaging")}>
  Packaging
</button>

<button onClick={() => updateOrder(order.id, "processing")}>
  Processing
</button>

<button onClick={() => updateOrder(order.id, "dispatched")}>
  Dispatched
</button>

<button onClick={() => updateOrder(order.id, "in_transit")}>
  In Transit
</button>

<button onClick={() => updateOrder(order.id, "out_for_delivery")}>
  Out for Delivery
</button>

<button onClick={() => updateOrder(order.id, "delivered")}>
  Delivered
</button>

<button onClick={() => updateOrder(order.id, "delivery_failed")}>
  Delivery Failed
</button>
        </div>
      )}
    </div>
  ))}
</section>
</main>
);
}
