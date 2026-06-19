"use client";

export default function HeroCard() {
  return (
    <div className="relative mx-auto h-60 w-full max-w-md rounded-[2rem] border border-white/20 bg-gradient-to-br from-[#8B5CF6] via-[#111827] to-[#00E5FF] p-7 shadow-2xl shadow-purple-500/30">
      <div className="flex justify-between">
        <div>
          <p className="tracking-[0.35em] text-white/60">VILTRUM</p>
          <h3 className="mt-3 text-2xl font-black">Crypto Card</h3>
        </div>
        <div className="h-12 w-16 rounded-xl bg-yellow-400" />
      </div>

      <p className="mt-12 text-xl tracking-[0.25em]">
        4242 4242 4242 1234
      </p>

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
