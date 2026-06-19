export default function PurchasePage() {
  return (
    <main className="viltrum-gradient min-h-screen p-10">
      <h1 className="text-center text-5xl font-black">
        Choose Your Card
      </h1>

      <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-3">

        <a
          href="/checkout/virtual"
          className="viltrum-glass rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold">
            Virtual Card
          </h2>

          <p className="mt-4 text-white/70">
            $5
          </p>

          <p className="mt-4 text-white/70">
            First 1000 users receive $5 bonus.
          </p>
        </a>

        <a
          href="/checkout/physical"
          className="viltrum-glass rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold">
            Physical Card
          </h2>

          <p className="mt-4 text-white/70">
            $60
          </p>

          <p className="mt-4 text-white/70">
            Includes $15 bonus.
          </p>
        </a>

        <a
          href="/checkout/free"
          className="viltrum-glass rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold">
            Free Mint
          </h2>

          <p className="mt-4 text-white/70">
            Free inactive card + NFT.
          </p>
        </a>

      </div>
    </main>
  );
}
