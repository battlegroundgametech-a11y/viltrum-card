"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);

  async function login() {
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert("Wrong password");
      return;
    }

    localStorage.setItem(
      "viltrum_admin_password",
      password
    );

    setOrders(data.orders);
    setAuthorized(true);
  }

  async function refreshOrders() {
    const saved =
      localStorage.getItem(
        "viltrum_admin_password"
      ) || "";

    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: saved
      })
    });

    const data = await res.json();

    if (data.success) {
      setOrders(data.orders);
    }
  }

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "viltrum_admin_password"
      );

    if (!saved) return;

    setPassword(saved);

    fetch("/api/admin/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password: saved
      })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
          setAuthorized(true);
        }
      });
  }, []);

  async function updateOrder(
    id: string,
    action: string
  ) {
    const saved =
      localStorage.getItem(
        "viltrum_admin_password"
      ) || "";

    const res = await fetch(
      "/api/admin/update-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: saved,
          orderId: id,
          action
        })
      }
    );

    const data = await res.json();

    if (data.success) {
      refreshOrders();
    } else {
      alert(data.error);
    }
  }

  if (!authorized) {
    return (
      <main className="admin-login">
        <h1>Viltrum Admin</h1>

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={login}>
          Login
        </button>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <h1>Viltrum Admin Panel</h1>

      <button
        onClick={() =>
          orders
            .filter(
              (o) =>
                o.status ===
                "pending_physical_approval"
            )
            .forEach((o) =>
              updateOrder(o.id, "approve")
            )
        }
      >
        Approve All Physical
      </button>

      <button
        onClick={() =>
          orders
            .filter(
              (o) =>
                o.status ===
                "pending_free_approval"
            )
            .forEach((o) =>
              updateOrder(o.id, "approve")
            )
        }
      >
        Approve All Free
      </button>

      {orders.map((order) => (
        <div
          key={order.id}
          className="admin-order"
        >
          <h3>
            {order.card_type}
          </h3>

          <p>{order.full_name}</p>

          <p>{order.status}</p>

          <button
            onClick={() =>
              updateOrder(
                order.id,
                "approve"
              )
            }
          >
            Approve
          </button>

          <button
            onClick={() =>
              updateOrder(
                order.id,
                "reject"
              )
            }
          >
            Reject
          </button>

          {order.card_type ===
            "physical" && (
            <>
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

              <button
                onClick={() =>
                  updateOrder(
                    order.id,
                    "shipped"
                  )
                }
              >
                Shipped
              </button>

              <button
                onClick={() =>
                  updateOrder(
                    order.id,
                    "delivered"
                  )
                }
              >
                Delivered
              </button>
            </>
          )}
        </div>
      ))}
    </main>
  );
}
