import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05060A] text-white">
      <HamburgerMenu />

      <section className="relative min-h-screen px-5 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,229,255,0.25),transparent_35%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:min-h-[80vh] lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300 lg:mx-0">
              Sepolia Testing Version
            </div>

            <h1 className="text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
              The Future of{" "}
              <span className="block bg-gradient-to-r from-purple-400 via-cyan-300 to-yellow-300 bg-clip-text text-transparent">
                Crypto Cards
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70 lg:mx-0">
              Viltrum Card is a premium demo crypto card platform built for
              virtual cards, physical cards, free mint cards, reload features,
              withdrawals, NFT ownership, Telegram verification, and wallet connection.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/login"
                className="rounded-2xl bg-purple-500 px-8 py-4 text-center text-lg font-bold shadow-xl shadow-purple-500/30"
              >
                Sign Up
              </a>

              <a
                href="#cards"
                className="rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-center text-lg font-bold backdrop-blur-xl"
              >
                Explore Cards
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroCard />
          </div>
        </div>
      </section>

      <section id="cards" className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="text-center text-4xl font-black sm:text-5xl">
          Choose Your Viltrum Card
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
            <h3 className="text-2xl font-bold">Virtual Card</h3>
            <p className="mt-3 text-white/70">
              Price: $5. First 1000 buyers get a $5 bonus. Includes virtual card and NFT.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-400/30 bg-purple-500/10 p-7 backdrop-blur-xl">
            <h3 className="text-2xl font-bold">Physical Card</h3>
            <p className="mt-3 text-white/70">
              Price: $60. Every buyer gets $15 bonus, virtual card, future physical card, and NFT.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 backdrop-blur-xl">
            <h3 className="text-2xl font-bold">Free Mint</h3>
            <p className="mt-3 text-white/70">
              Free inactive demo card and NFT. Activate after minimum reload set by admin.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
