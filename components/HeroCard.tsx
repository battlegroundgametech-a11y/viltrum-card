"use client";

export default function HeroCard() {
  return (
    <div className="float-card card-shine relative mx-auto mt-10 h-56 w-full max-w-sm rounded-3xl border border-white/20 bg-gradient-to-br from-viltrumPurple via-[#111827] to-viltrumCyan p-6 shadow-2xl shadow-viltrumPurple/30 md:h-64 md:max-w-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Viltrum
          </p>
          <h3 className="mt-2 text-2xl font-black">Crypto Card</h3>
        </div>
        <div className="h-12 w-16 rounded-xl bg-viltrumGold/90" />
      </div>

      <div className="mt-12 text-xl font-semibold tracking-[0.22em]">
        4242 4242 4242 1234
      </div>

      <div className="mt-8 flex justify-between text-sm">
        <div>
          <p className="text-white/50">CARD HOLDER</p>
          <p className="font-bold">SATOSHI NAKAMOTO</p>
        </div>
        <div>
          <p className="text-white/50">EXP</p>
          <p className="font-bold">12/30</p>
        </div>
      </div>
    </div>
  );
}
