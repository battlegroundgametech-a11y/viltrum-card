"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data || []);
  }

  async function approveOrder(order: any) {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "approved"
      })
      .eq("id", order.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Card approved. User can now view card in Telegram bot.");
    loadOrders();
  }

  function loginAdmin() {
  const adminPassword =
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (secret !== adminPassword) {
    alert("Incorrect password");
    return;
  }

  localStorage.setItem("viltrum_admin", "authorized");
  setLoggedIn(true);
  loadOrders();
}

  useEffect(() => {
    const saved = localStorage.getItem("viltrum_admin");
    if (saved) {
      setSecret(saved);
      setLoggedIn(true);
      loadOrders();
    }
  }, []);

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <div className="admin-login-box">
          <h1>Viltrum Admin</h1>
          <p>Enter admin password to manage card approvals.</p>

          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin Password"
            type="password"
          />

          <button onClick={loginAdmin}>Enter Admin Panel</button>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <p>Viltrum Control Center</p>
          <h1>Admin Orders</h1>
        </div>

        <button onClick={loadOrders}>Refresh</button>
      </div>

      <div className="admin-orders">
        {orders.map((order) => (
          <div key={order.id} className="admin-order-card">
            <div className="admin-order-top">
              <div>
                <h2>{order.order_id}</h2>
                <p>{order.full_name || "No name"}</p>
              </div>

              <span className={`admin-status ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="admin-grid">
              <div>
                <span>Card Type</span>
                <b>{order.card_type}</b>
              </div>

              <div>
                <span>Telegram</span>
                <b>@{order.telegram_username || "not linked"}</b>
              </div>

              <div>
                <span>Wallet</span>
                <b>
                  {order.wallet_address
                    ? `${order.wallet_address.slice(0, 6)}...${order.wallet_address.slice(-4)}`
                    : "not connected"}
                </b>
              </div>

              <div>
                <span>Shipment</span>
                <b>{order.shipment_status || "not started"}</b>
              </div>
            </div>

            {order.status !== "approved" && order.status !== "active" ? (
              <button
                onClick={() => approveOrder(order)}
                className="approve-btn"
              >
                Approve Card
              </button>
            ) : (
              <div className="approved-box">Approved</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
