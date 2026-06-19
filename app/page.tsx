import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="viltrum-bg min-h-screen overflow-x-hidden text-white">
      <HamburgerMenu />

      <section className="relative flex min-h-screen items-center px-5 py-20 sm:px-8 lg:px-14">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="animate-soft-rise text-center lg:text-left">
            <div className="mx-auto mb-5 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300 lg:mx-0">
              Sepolia Testing Version
            </div>

            <h1 className="text-[44px] font-black leading-[1.02] sm:text-6xl lg:text-[68px]">
              The Future of{" "}
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-300 bg-clip-text text-transparent">
                Crypto Cards
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/70 sm:text-lg lg:mx-0">
              Viltrum Card is a premium demo crypto card platform built for
              virtual cards, physical cards, free mint cards, reload features,
              withdrawals, NFT ownership, Telegram verification, and wallet
              connection.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/login"
                className="rounded-2xl bg-purple-500 px-8 py-4 text-center font-bold shadow-xl shadow-purple-500/30 transition duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Sign Up
              </a>

              <a
                href="#cards"
                className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-center font-bold backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Explore Cards
              </a>
            </div>
          </div>

          <div className="animate-soft-rise flex justify-center lg:justify-end">
            <HeroCard />
          </div>
        </div>
      </section>

      <section id="cards" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-4xl font-black sm:text-5xl">
          Choose Your Viltrum Card
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <a
            href="/checkout/virtual"
            className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/40"
          >
            <h3 className="text-2xl font-bold">Virtual Card</h3>
            <p className="mt-3 text-white/70">
              $5 card. First 1000 buyers get a $5 bonus.
            </p>
          </a>

          <a
            href="/checkout/physical"
            className="rounded-3xl border border-purple-400/30 bg-purple-500/10 p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-300/60"
          >
            <h3 className="text-2xl font-bold">Physical Card</h3>
            <p className="mt-3 text-white/70">
              $60 card. Includes $15 bonus and shipment tracking.
            </p>
          </a>

          <a
            href="/checkout/free"
            className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/40"
          >
            <h3 className="text-2xl font-bold">Free Mint</h3>
            <p className="mt-3 text-white/70">
              Free inactive card. Activate with minimum reload.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
