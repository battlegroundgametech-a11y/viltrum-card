"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-50 rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-xl backdrop-blur-xl"
      >
        <Menu size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md">
          <div className="ml-auto h-full w-[85%] max-w-sm bg-[#070A12] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Viltrum</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white p-2 text-black"
              >
                <X />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <a className="rounded-2xl bg-viltrumPurple px-5 py-4 text-center font-bold" href="/login">
                Sign Up / Login
              </a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/">Home</a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/dashboard">Dashboard</a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/#about">About Us</a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/#support">Help & Support</a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/#faq">FAQ</a>
              <a className="rounded-2xl bg-white/10 px-5 py-4" href="/#social">Social Media</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
