"use client";

import HamburgerMenu from "@/components/HamburgerMenu";

export default function LoginPage() {
  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "";

  return (
    <main className="viltrum-gradient flex min-h-screen items-center justify-center px-5">
      <HamburgerMenu />

      <div className="viltrum-glass max-w-lg rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-black">Telegram Login</h1>

        <p className="mt-4 text-white/70">
          Sign up or log in with Telegram to continue to Viltrum Card.
        </p>

        <div className="mt-8 rounded-2xl bg-black/40 p-5">
          <p className="mb-4 text-sm text-white/60">
            Click the Telegram button below.
          </p>

          <script
            async
            src="https://telegram.org/js/telegram-widget.js?22"
            data-telegram-login={botName}
            data-size="large"
            data-auth-url="/api/telegram-auth"
            data-request-access="write"
          />
        </div>

        <p className="mt-5 text-xs text-white/40">
          After verification, you will be redirected to connect your wallet.
        </p>
      </div>
    </main>
  );
}
