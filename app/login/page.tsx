"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const telegram_username = String(form.get("telegram_username") || "").replace("@", "");
    const telegram_name = String(form.get("telegram_name") || "");
    const phone_number = String(form.get("phone_number") || "");

    const telegram_id = telegram_username.toLowerCase();

    const { error } = await supabase.from("profiles").upsert({
      telegram_id,
      telegram_username,
      telegram_name,
      phone_number,
      telegram_verified: true
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    localStorage.setItem("viltrum_user", telegram_id);
    localStorage.setItem("viltrum_telegram_username", telegram_username);

    window.location.href = "/connect-wallet";
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview physical-preview">
        <span>VILTRUM</span>
        <h2>Telegram Login</h2>
        <p>VERIFY • CONNECT • PURCHASE</p>
      </div>

      <div className="checkout-form-box">
        <h1>Sign Up / Login</h1>

        <form onSubmit={handleLogin}>
          <input name="phone_number" required placeholder="Phone Number" />
          <input name="telegram_name" required placeholder="Telegram Name" />
          <input name="telegram_username" required placeholder="Telegram Username" />

          <button disabled={loading}>
            {loading ? "Saving..." : "Continue to Wallet"}
          </button>
        </form>
      </div>
    </main>
  );
}
