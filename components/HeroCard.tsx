"use client";

export default function HeroCard() {
  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]">
      <div className="relative aspect-[1.62/1] w-full overflow-hidden rounded-[26px] border border-cyan-300/30 bg-gradient-to-br from-purple-500 via-[#111827] to-cyan-400 p-6 shadow-2xl shadow-cyan-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_25%),radial-gradient(circle_at_90%_80%,rgba(0,229,255,0.35),transparent_35%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <p className="tracking-[0.35em] text-white/60">VILTRUM</p>
              <h3 className="mt-3 text-2xl font-black text-white">Crypto Card</h3>
            </div>
            <div className="h-12 w-16 rounded-2xl bg-yellow-400 shadow-lg" />
          </div>

          <p className="text-lg tracking-[0.22em] text-white sm:text-xl">
            4242 4242 4242 1234
          </p>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-white/50">CARD HOLDER</p>
              <p className="font-bold text-white">SATOSHI NAKAMOTO</p>
            </div>
            <div>
              <p className="text-white/50">EXP</p>
              <p className="font-bold text-white">12/30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
