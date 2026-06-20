"use client";

import { useEffect } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function LoginPage() {
  useEffect(() => {
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
    const container = document.getElementById("telegram-login-widget");

    if (!container || !botName) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-request-access", "write");
    script.setAttribute(
      "data-auth-url",
      `${window.location.origin}/api/telegram-callback`
    );

    container.appendChild(script);
  }, []);

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview physical-preview">
        <span>VILTRUM</span>
        <h2>Telegram Login</h2>
        <p>FRAGMENT STYLE • SECURE ACCESS</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Sign Up / Login</h1>

        <p className="mt-3 text-white/60">
          Continue with Telegram to access Viltrum Card.
        </p>

        <div className="mt-8 flex justify-center" id="telegram-login-widget" />
      </div>
    </main>
  );
}
