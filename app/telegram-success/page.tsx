"use client";

import { useEffect } from "react";

export default function TelegramSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    localStorage.setItem("viltrum_user", params.get("id") || "");
    localStorage.setItem("viltrum_telegram_username", params.get("username") || "");
    localStorage.setItem("viltrum_telegram_name", params.get("name") || "");

    window.location.href = "/connect-wallet";
  }, []);

  return (
    <main className="checkout-premium">
      <div className="checkout-form-box text-center">
        <h1>Telegram Connected</h1>
        <p className="mt-3 text-white/60">Redirecting to wallet connection...</p>
      </div>
    </main>
  );
}
