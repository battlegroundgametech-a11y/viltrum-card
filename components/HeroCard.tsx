"use client";

export default function HeroCard() {
  return (
    <div className="animate-float-card w-full max-w-[330px] sm:max-w-[390px] lg:max-w-[430px]">
      <div className="card-shine animate-card-glow relative aspect-[1.62/1] w-full rounded-[28px] border border-cyan-300/30 bg-gradient-to-br from-purple-500 via-[#111827] to-cyan-400 p-5 sm:p-6">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.24),transparent_26%),radial-gradient(circle_at_88%_80%,rgba(0,229,255,0.35),transparent_35%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.38em] text-white/60 sm:text-sm">
                VILTRUM
              </p>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                Crypto Card
              </h3>
            </div>

            <div className="h-10 w-14 rounded-2xl bg-yellow-400 shadow-xl sm:h-12 sm:w-16" />
          </div>

          <p className="text-base tracking-[0.2em] text-white sm:text-xl">
            4242 4242 4242 1234
          </p>

          <div className="flex justify-between gap-4 text-[11px] sm:text-sm">
            <div>
              <p className="text-white/50">CARD HOLDER</p>
              <p className="font-bold text-white">SATOSHI NAKAMOTO</p>
            </div>

            <div className="text-right">
              <p className="text-white/50">EXP</p>
              <p className="font-bold text-white">12/30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
