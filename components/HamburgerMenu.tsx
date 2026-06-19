"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  function handleAuth() {
    if (loggedIn) {
      setLoggedIn(false);
      localStorage.removeItem("viltrum_user");
      alert("Logged out successfully");
    } else {
      window.location.href = "/login";
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-50 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-xl"
      >
        <Menu />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md">
          <div className="ml-auto h-full w-[82%] max-w-sm border-l border-white/10 bg-[#090B12] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Viltrum Menu</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-4 text-lg">
              <button onClick={handleAuth} className="rounded-xl bg-viltrumPurple px-5 py-3 font-bold">
                {loggedIn ? "Logout" : "Sign Up / Login"}
              </button>

              <a href="/" className="rounded-xl bg-white/10 px-5 py-3">Home</a>
              <a href="/dashboard" className="rounded-xl bg-white/10 px-5 py-3">Dashboard</a>
              <a href="/#about" className="rounded-xl bg-white/10 px-5 py-3">About Us</a>
              <a href="/#support" className="rounded-xl bg-white/10 px-5 py-3">Help & Support</a>
              <a href="/#faq" className="rounded-xl bg-white/10 px-5 py-3">FAQ</a>
              <a href="/#social" className="rounded-xl bg-white/10 px-5 py-3">Social Media</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
