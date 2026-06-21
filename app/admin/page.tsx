"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);

  const [secret, setSecret] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  async function loadAll() {
    await loadOrders();
    await loadControls();
  }

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

  async function loadControls() {
    const { data: settingsData } = await supabase
      .from("platform_settings")
      .select("*")
      .eq("id", 1)
      .single();

    const { data: pricingData } = await supabase
      .from("pricing")
      .select("*")
      .eq("id", 1)
      .single();

    const { data: limitsData } = await supabase
      .from("purchase_limits")
      .select("*")
      .eq("id", 1)
      .single();

    const { data: inventoryData } = await supabase
      .from("card_inventory")
      .select("*")
      .eq("id", 1)
      .single();

    setSettings(settingsData);
    setPricing(pricingData);
    setLimits(limitsData);
    setInventory(inventoryData);
  }

  async function approveOrder(order: any) {
    const res = await fetch("/api/admin/approve-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
        order_id: order.id
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Approval failed");
      return;
    }

    alert("Card approved and user notified on Telegram.");
    loadOrders();
  }

  async function saveControls() {
    const { error: settingsError } = await supabase
      .from("platform_settings")
      .update(settings)
      .eq("id", 1);

    const { error: pricingError } = await supabase
      .from("pricing")
      .update(pricing)
      .eq("id", 1);

    const { error: limitsError } = await supabase
      .from("purchase_limits")
      .update(limits)
      .eq("id", 1);

    const { error: inventoryError } = await supabase
      .from("card_inventory")
      .update(inventory)
      .eq("id", 1);

    if (settingsError || pricingError || limitsError || inventoryError) {
      alert("Failed to save controls");
      return;
    }

    alert("Platform controls saved successfully.");
    loadControls();
  }

  function loginAdmin() {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (secret !== adminPassword) {
      alert("Incorrect password");
      return;
    }

    localStorage.setItem("viltrum_admin", "authorized");
    localStorage.setItem("viltrum_admin_password", secret);
    setLoggedIn(true);
    loadAll();
  }

  useEffect(() => {
    const saved = localStorage.getItem("viltrum_admin");

    if (saved === "authorized") {
      setLoggedIn(true);
      loadAll();
    }
  }, []);

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <div className="admin-login-box">
          <h1>Viltrum Admin</h1>
          <p>Enter admin password to manage the platform.</p>

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
        <button
          onClick={() => {
            localStorage.removeItem("viltrum_admin");
            localStorage.removeItem("viltrum_admin_password");
            location.reload();
          }}
        >
          Logout
        </button>

        <div>
          <p>Viltrum Control Center</p>
          <h1>Admin Dashboard</h1>
        </div>

        <button onClick={loadAll}>Refresh</button>
      </div>

      {settings && pricing && limits && inventory && (
        <div className="admin-order-card" style={{ maxWidth: 1200, margin: "0 auto 30px" }}>
          <h2>Platform Controls</h2>

          <div className="admin-grid">
            <div>
              <span>Virtual Price</span>
              <input value={pricing.virtual_price} onChange={(e) => setPricing({ ...pricing, virtual_price: e.target.value })} />
            </div>

            <div>
              <span>Physical Price</span>
              <input value={pricing.physical_price} onChange={(e) => setPricing({ ...pricing, physical_price: e.target.value })} />
            </div>

            <div>
              <span>Free Mint Price</span>
              <input value={pricing.free_price} onChange={(e) => setPricing({ ...pricing, free_price: e.target.value })} />
            </div>

            <div>
              <span>Virtual Supply</span>
              <input value={inventory.virtual_supply} onChange={(e) => setInventory({ ...inventory, virtual_supply: e.target.value })} />
            </div>

            <div>
              <span>Physical Supply</span>
              <input value={inventory.physical_supply} onChange={(e) => setInventory({ ...inventory, physical_supply: e.target.value })} />
            </div>

            <div>
              <span>Free Mint Supply</span>
              <input value={inventory.free_supply} onChange={(e) => setInventory({ ...inventory, free_supply: e.target.value })} />
            </div>

            <div>
              <span>Virtual Limit / Wallet</span>
              <input value={limits.virtual_limit_per_wallet} onChange={(e) => setLimits({ ...limits, virtual_limit_per_wallet: e.target.value })} />
            </div>

            <div>
              <span>Physical Limit / Wallet</span>
              <input value={limits.physical_limit_per_wallet} onChange={(e) => setLimits({ ...limits, physical_limit_per_wallet: e.target.value })} />
            </div>

            <div>
              <span>Free Limit / Wallet</span>
              <input value={limits.free_limit_per_wallet} onChange={(e) => setLimits({ ...limits, free_limit_per_wallet: e.target.value })} />
            </div>

            <div>
              <span>Deposits Enabled</span>
              <select value={settings.deposits_enabled ? "true" : "false"} onChange={(e) => setSettings({ ...settings, deposits_enabled: e.target.value === "true" })}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <span>Withdrawals Enabled</span>
              <select value={settings.withdrawals_enabled ? "true" : "false"} onChange={(e) => setSettings({ ...settings, withdrawals_enabled: e.target.value === "true" })}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <span>Min Deposit</span>
              <input value={settings.min_deposit} onChange={(e) => setSettings({ ...settings, min_deposit: e.target.value })} />
            </div>

            <div>
              <span>Max Deposit</span>
              <input value={settings.max_deposit} onChange={(e) => setSettings({ ...settings, max_deposit: e.target.value })} />
            </div>

            <div>
              <span>Min Withdrawal</span>
              <input value={settings.min_withdrawal} onChange={(e) => setSettings({ ...settings, min_withdrawal: e.target.value })} />
            </div>

            <div>
              <span>Max Withdrawal</span>
              <input value={settings.max_withdrawal} onChange={(e) => setSettings({ ...settings, max_withdrawal: e.target.value })} />
            </div>
          </div>

          <button onClick={saveControls} className="approve-btn">
            Save Platform Controls
          </button>
        </div>
      )}

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
