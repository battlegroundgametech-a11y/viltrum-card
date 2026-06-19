import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="viltrum-premium-bg min-h-screen overflow-x-hidden text-white">
      <HamburgerMenu />

      <div className="grid-overlay pointer-events-none absolute inset-0 h-screen" />

      <section className="relative flex min-h-screen items-center px-5 py-20 sm:px-8 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div className="animate-rise text-center lg:text-left">
            <div className="mx-auto mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 text-sm font-semibold text-cyan-200 lg:mx-0">
              Sepolia Testnet • Telegram Verified • Wallet Connected
            </div>

            <h1 className="text-[43px] font-black leading-[1.02] sm:text-6xl lg:text-[76px]">
              Finance-grade{" "}
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-300 bg-clip-text text-transparent">
                Crypto Cards
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg lg:mx-0">
              Viltrum is a premium testnet crypto card experience with virtual
              cards, physical card orders, free mint cards, NFT ownership,
              Telegram verification, reload controls, withdrawals, and shipment
              tracking.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/login"
                className="rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 px-9 py-4 text-center font-black text-white shadow-2xl shadow-purple-500/30 transition duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Sign Up
              </a>

              <a
                href="#cards"
                className="rounded-2xl border border-white/15 bg-white/10 px-9 py-4 text-center font-black backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Explore Cards
              </a>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-2xl font-black">$5</p>
                <p className="mt-1 text-xs text-white/55">Virtual Card</p>
              </div>

              <div className="glass-card rounded-2xl p-4">
                <p className="text-2xl font-black">$60</p>
                <p className="mt-1 text-xs text-white/55">Physical Card</p>
              </div>

              <div className="glass-card rounded-2xl p-4">
                <p className="text-2xl font-black">Free</p>
                <p className="mt-1 text-xs text-white/55">NFT Mint</p>
              </div>
            </div>
          </div>

          <div className="animate-rise flex justify-center lg:justify-end">
            <HeroCard />
          </div>
        </div>
      </section>

      <section id="cards" className="relative mx-auto max-w-7xl px-5 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Viltrum Products
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            Choose Your Card
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <a href="/checkout/virtual" className="glass-card rounded-[2rem] p-8 transition duration-300 hover:-translate-y-3 hover:border-cyan-300/40">
            <p className="text-sm font-bold text-cyan-300">01</p>
            <h3 className="mt-4 text-3xl font-black">Virtual Card</h3>
            <p className="mt-4 text-white/65">
              $5 demo card with NFT ownership. First 1000 buyers get a $5 bonus.
            </p>
          </a>

          <a href="/checkout/physical" className="glass-card rounded-[2rem] border-purple-400/40 bg-purple-500/10 p-8 transition duration-300 hover:-translate-y-3 hover:border-purple-300/70">
            <p className="text-sm font-bold text-purple-300">02</p>
            <h3 className="mt-4 text-3xl font-black">Physical Card</h3>
            <p className="mt-4 text-white/65">
              $60 card with $15 bonus, virtual card access, NFT, and shipment tracking.
            </p>
          </a>

          <a href="/checkout/free" className="glass-card rounded-[2rem] p-8 transition duration-300 hover:-translate-y-3 hover:border-yellow-300/40">
            <p className="text-sm font-bold text-yellow-300">03</p>
            <h3 className="mt-4 text-3xl font-black">Free Mint</h3>
            <p className="mt-4 text-white/65">
              Free inactive card and NFT. Activate after minimum reload set by admin.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}
