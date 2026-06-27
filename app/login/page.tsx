
"use client";

import { useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_username: form.get("telegram_username"),
        password: form.get("password")
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Login failed");
      setLoading(false);
      return;
    }

    localStorage.setItem("viltrum_user", data.telegram_id);
    localStorage.setItem("viltrum_telegram_username", data.telegram_username);
    localStorage.setItem("viltrum_telegram_name", data.telegram_name || "");

    window.location.href = "/connect-wallet";
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview virtual-preview">
        <span>VILTRUM</span>
        <h2>Account Login</h2>
        <p>USERNAME • PASSWORD • WALLET</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Login</h1>

        <form onSubmit={login} className="mt-6 flex flex-col gap-4">
          <input name="telegram_username" required placeholder="Telegram Username" />
          <input name="password" required type="password" placeholder="Password" />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <a href="/signup" className="mt-5 block text-white/60">
          New user? Create account with Telegram OTP
        </a>

        <a href="/forgot-password" className="mt-3 block text-yellow-400 font-bold">
          Forgot password?
        </a>
      </div>
    </main>
  );
}
