"use client";

import { useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";

export default function ForgotPasswordPage() {
  const [telegramUsername, setTelegramUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState("");

  const botName = process.env.NEXT_PUBLIC_OTP_BOT_NAME;

  function openTelegramResetBot() {
    setMessage("Open Telegram, send /reset, then enter the OTP here.");
    window.open(`https://t.me/${botName}?start=reset`, "_blank");
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setResetLoading(true);

    const res = await fetch("/api/auth/forgot-password/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        telegram_username: telegramUsername,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    });

    const data = await res.json();

    if (!data.success) {
      setMessage(data.error || "Password reset failed");
      setResetLoading(false);
      return;
    }

    setMessage("Password changed successfully. Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  }

  return (
    <main className="checkout-premium">
      <HamburgerMenu />

      <div className="checkout-card-preview virtual-preview">
        <span>VILTRUM</span>
        <h2>Password Reset</h2>
        <p>TELEGRAM • OTP • NEW PASSWORD</p>
      </div>

      <div className="checkout-form-box text-center">
        <h1>Forgot Password</h1>

        <p className="mt-3 text-white/60">
          Enter your Telegram username, open the bot, send /reset, then use the OTP here.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <input
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            placeholder="Telegram Username"
            required
          />

          <button
            type="button"
            onClick={openTelegramResetBot}
            disabled={!botName}
          >
            Open Telegram Reset Bot
          </button>
        </div>

        <form onSubmit={changePassword} className="mt-6 flex flex-col gap-4">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Reset OTP"
            required
          />

          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New Password"
            required
          />

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm New Password"
            required
          />

          <button disabled={resetLoading}>
            {resetLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>

        {message && <p className="mt-5 text-white/70">{message}</p>}

        <a href="/login" className="mt-5 block text-yellow-400 font-bold">
          Back to Login
        </a>
      </div>
    </main>
  );
}
