"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
 
  useEffect(() => {
    const saved = localStorage.getItem("viltrum_theme");

    if (saved === "light") {
      document.body.classList.add("light-mode");
      setLight(true);
    }

    const user = localStorage.getItem("viltrum_user");
    setLoggedIn(!!user);
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);

    if (next) {
      document.body.classList.add("light-mode");
      localStorage.setItem("viltrum_theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("viltrum_theme", "dark");
    }
  }

  function logout() {
    localStorage.removeItem("viltrum_user");
    localStorage.removeItem("viltrum_telegram_username");
    localStorage.removeItem("viltrum_telegram_name");
    localStorage.removeItem("viltrum_wallet");

    setLoggedIn(false);
    window.location.href = "/login";
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-50 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-xl"
      >
        <Menu size={28} />
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
              <button
                onClick={toggleTheme}
                className="rounded-2xl bg-yellow-400 px-5 py-4 font-black text-black"
              >
                Theme: {light ? "Light" : "Dark"}
              </button>

              {!loggedIn && (
                <>
                  <a
                    className="rounded-2xl bg-yellow-400 px-5 py-4 text-center font-black text-black"
                    href="/signup"
                  >
                    Sign Up
                  </a>

                  <a
                    className="rounded-2xl bg-white/10 px-5 py-4 text-center font-bold text-white"
                    href="/login"
                  >
                    Login
                  </a>
                </>
              )}

              {loggedIn && (
                <button
                  onClick={logout}
                  className="rounded-2xl bg-red-500 px-5 py-4 text-center font-black text-white"
                >
                  Logout
                </button>
              )}

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/">
                Home
              </a>

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/purchase">
                Purchase
              </a>

              <a
               className="rounded-2xl bg-white/10 px-5 py-4 text-white"
               href={
                 localStorage.getItem("viltrum_user")
                   ? "/manage-card"
                   : "/login"
               }
              >
                 Manage Card
              </a>

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/#about">
                About Us
              </a>

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/#support">
                Help & Support
              </a>

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/#faq">
                FAQ
              </a>

              <a className="rounded-2xl bg-white/10 px-5 py-4 text-white" href="/#social">
                Social Media
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
