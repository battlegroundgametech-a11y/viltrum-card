"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useDisconnect } from "wagmi";

const socialItems = [
  {
    name: "Telegram",
    appUrl: "tg://resolve",
    webUrl: "https://t.me/",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M9.04 15.47 8.68 20.5c.52 0 .75-.22 1.02-.49l2.45-2.34 5.08 3.72c.93.51 1.59.24 1.84-.86l3.34-15.66c.3-1.38-.5-1.92-1.4-1.58L1.39 10.86c-1.34.52-1.32 1.27-.23 1.6l5.02 1.56L17.84 6.7c.55-.36 1.05-.16.64.2z" />
      </svg>
    )
  },
  {
    name: "X",
    appUrl: "twitter://user?screen_name=",
    webUrl: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.25-8.29L2.96 2h6.4l4.42 5.84zm-1.1 17.84h1.72L8.42 4.05H6.58z" />
      </svg>
    )
  },
  {
    name: "Farcaster",
    appUrl: "warpcast://",
    webUrl: "https://warpcast.com/",
    icon: (
      <svg viewBox="0 0 448 448" width="24" height="24" fill="currentColor">
        <path d="M82 99h284v34h-34v34h34v181h-58l-30-131c-11-48-29-70-54-70s-43 22-54 70l-30 131H82V167h34v-34H82V99z" />
      </svg>
    )
  }
];

function openSocial(appUrl: string, webUrl: string) {
  const openedAt = Date.now();
  window.location.href = appUrl;

  setTimeout(() => {
    if (Date.now() - openedAt < 1800) {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }
  }, 900);
}

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [wallet, setWallet] = useState("");
  const [showSocials, setShowSocials] = useState(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const saved = localStorage.getItem("viltrum_theme");

    if (saved === "light") {
      document.body.classList.add("light-mode");
      setLight(true);
    }

    const user = localStorage.getItem("viltrum_user");
    const savedWallet = localStorage.getItem("viltrum_wallet");

    setLoggedIn(!!user);

    if (user && savedWallet) {
      setWallet(`${savedWallet.slice(0, 6)}...${savedWallet.slice(-4)}`);
    }
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

  function disconnectWallet() {
    disconnect();
    localStorage.removeItem("viltrum_wallet");
    setWallet("");
    window.location.href = "/connect-wallet";
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
          <div className="ml-auto h-full w-[85%] max-w-sm overflow-y-auto bg-[#070A12] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Viltrum</h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full bg-white p-2 text-black"
              >
                <X />
              </button>
            </div>

            {wallet && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[3px] text-yellow-400">
                  Connected Wallet
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-2xl bg-black/40 px-4 py-3 font-black text-white">
                    {wallet}
                  </span>

                  <button
                    onClick={disconnectWallet}
                    className="rounded-2xl bg-red-500 px-4 py-3 font-black text-white"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4">
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
                href={loggedIn ? "/manage-card" : "/login"}
              >
                Manage Card
              </a>

              <button
                type="button"
                onClick={() => setShowSocials((prev) => !prev)}
                className="rounded-2xl bg-white/10 px-5 py-4 text-left font-bold text-white"
              >
                Social Media
              </button>

              {showSocials && (
                <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
                  {socialItems.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => openSocial(item.appUrl, item.webUrl)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-left text-white transition hover:border-yellow-400/50 hover:bg-yellow-400/10"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                        {item.icon}
                      </span>

                      <span>
                        <span className="block font-black">{item.name}</span>
                        <span className="text-xs text-white/50">Open {item.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
