import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="viltrum-gradient min-h-screen overflow-hidden">
      <HamburgerMenu />

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 py-24 text-center md:flex-row md:text-left">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex rounded-full border border-viltrumCyan/40 bg-viltrumCyan/10 px-4 py-2 text-sm text-viltrumCyan">
            Sepolia Testing Version
          </div>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            The Future of{" "}
            <span className="bg-gradient-to-r from-viltrumPurple via-viltrumCyan to-viltrumGold bg-clip-text text-transparent">
              Crypto Cards
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/70">
            Viltrum Card is a premium demo crypto card platform built for
            virtual cards, physical cards, free mint cards, reload features,
            withdrawals, NFT ownership, Telegram verification, and wallet
            connection.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="/login"
              className="rounded-2xl bg-viltrumPurple px-8 py-4 text-center font-bold shadow-lg shadow-viltrumPurple/30"
            >
              Sign Up / Login
            </a>

            <a
              href="#cards"
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-center font-bold backdrop-blur-lg"
            >
              Explore Cards
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <HeroCard />
        </div>
      </section>

      <section id="cards" className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center text-4xl font-black">Choose Your Viltrum Card</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="viltrum-glass rounded-3xl p-7">
            <h3 className="text-2xl font-bold">Virtual Card</h3>
            <p className="mt-3 text-white/70">
              Price: $5. First 1000 buyers get a $5 bonus. Includes virtual card and NFT.
            </p>
          </div>

          <div className="viltrum-glass rounded-3xl p-7">
            <h3 className="text-2xl font-bold">Physical Card</h3>
            <p className="mt-3 text-white/70">
              Price: $60. Every buyer gets $15 bonus, virtual card, future physical card, and NFT.
            </p>
          </div>

          <div className="viltrum-glass rounded-3xl p-7">
            <h3 className="text-2xl font-bold">Free Mint</h3>
            <p className="mt-3 text-white/70">
              Free inactive demo card and NFT. Activate after minimum reload set by admin.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="text-4xl font-black">About Viltrum</h2>
        <p className="mt-5 text-white/70">
          Viltrum is a Sepolia testnet crypto card project designed to demonstrate
          wallet-based purchases, Telegram verification, card approval, NFT minting,
          reload controls, withdrawal controls, and physical card tracking.
        </p>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="text-center text-4xl font-black">FAQ</h2>

        <div className="mt-8 space-y-4">
          <div className="viltrum-glass rounded-2xl p-5">
            <h3 className="font-bold">Is this a real payment card?</h3>
            <p className="mt-2 text-white/70">
              This version is a Sepolia testing version using demo card details.
            </p>
          </div>

          <div className="viltrum-glass rounded-2xl p-5">
            <h3 className="font-bold">Do users need Telegram?</h3>
            <p className="mt-2 text-white/70">
              Yes. Signup and login are based on Telegram verification.
            </p>
          </div>

          <div className="viltrum-glass rounded-2xl p-5">
            <h3 className="font-bold">Can physical buyers track shipment?</h3>
            <p className="mt-2 text-white/70">
              Yes. Physical card buyers get a Track Shipment option in the Telegram bot.
            </p>
          </div>
        </div>
      </section>

      <section id="support" className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="text-4xl font-black">Help & Support</h2>
        <p className="mt-5 text-white/70">
          Support will be available through the Viltrum Telegram bot.
        </p>
      </section>

      <section id="social" className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h2 className="text-4xl font-black">Social Media</h2>
        <p className="mt-5 text-white/70">
          Add your official Telegram, X, Discord, and website links here.
        </p>
      </section>
    </main>
  );
}
