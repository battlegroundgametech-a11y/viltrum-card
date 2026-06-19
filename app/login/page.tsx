"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [showTelegram, setShowTelegram] = useState(false);

  useEffect(() => {
    if (!showTelegram) return;

    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

    window.onTelegramAuth = async function (user: any) {
      const res = await fetch("/api/telegram-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...user,
          phone_number: phone
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Telegram login failed");
        return;
      }

      localStorage.setItem("viltrum_user", data.telegram_id);
      localStorage.setItem("viltrum_telegram_username", data.telegram_username);
      localStorage.setItem("viltrum_telegram_name", data.telegram_name);
      localStorage.setItem("viltrum_phone", phone);

      alert("Telegram connected successfully");

      window.location.href = "/connect-wallet";
    };

    const container = document.getElementById("telegram-login-widget");
    if (!container || !botName) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    container.appendChild(script);
  }, [showTelegram, phone]);

  function startTelegram() {
    if (!phone.trim()) {
      alert("Please enter your mobile number first");
      return;
    }

    setShowTelegram(true);
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview physical-preview">
        <span>VILTRUM</span>
        <h2>Telegram Login</h2>
        <p>VERIFY • CONNECT • PURCHASE</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Sign Up / Login</h1>

        <p className="mt-3 text-white/60">
          Enter your mobile number first, then continue with Telegram.
        </p>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile Number"
          className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
        />

        {!showTelegram && (
          <button
            onClick={startTelegram}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black"
          >
            Sign Up with Telegram
          </button>
        )}

        {showTelegram && (
  <div className="mt-8">
    <p className="mb-4 text-white/50">
      Complete Telegram verification:
    </p>

    <div
      className="flex justify-center"
      id="telegram-login-widget"
    />

    <a
      href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}`}
      className="mt-5 inline-block rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 px-6 py-4 font-black text-black"
    >
      Open Telegram Bot
    </a>
  </div>
)}
        )}
      </div>
    </main>
  );
}
