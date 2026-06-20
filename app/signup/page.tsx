"use client";

import { useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const botName = process.env.NEXT_PUBLIC_OTP_BOT_NAME;

  async function signup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.get("name"),
        telegram_username: form.get("telegram_username"),
        otp: form.get("otp"),
        password: form.get("password")
      })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Signup failed");
      setLoading(false);
      return;
    }

    localStorage.setItem("viltrum_user", data.telegram_id);
    localStorage.setItem("viltrum_telegram_username", data.telegram_username);
    localStorage.setItem("viltrum_telegram_name", data.telegram_name);

    window.location.href = "/connect-wallet";
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview physical-preview">
        <span>VILTRUM</span>
        <h2>OTP Signup</h2>
        <p>BOT OTP • VERIFY • CONNECT</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Create Account</h1>

        <p className="mt-3 text-white/60">
          First open the OTP bot and get your 1-minute code.
        </p>

        <a
          href={`https://t.me/${botName}?start=signup`}
          target="_blank"
          className="mt-6 inline-block w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black"
        >
          Get OTP from Telegram Bot
        </a>

        <form onSubmit={signup} className="mt-6 flex flex-col gap-4">
          <input name="name" required placeholder="Full Name" />
          <input name="telegram_username" required placeholder="Telegram Username" />
          <input name="otp" required placeholder="OTP from Bot" />
          <input name="password" required type="password" placeholder="Create Password" />

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <a href="/login" className="mt-5 block text-white/60">
          Already have an account? Login
        </a>
      </div>
    </main>
  );
}
