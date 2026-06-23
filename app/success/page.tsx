"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const order = params.get("order");
  const secret = params.get("secret");
  const [showSecret, setShowSecret] = useState(false);

  return (
    <main className="v-home flex min-h-screen items-center justify-center px-5 py-24 text-white">
      <div className="max-w-xl rounded-[36px] border border-white/10 bg-white/[0.07] p-8 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl">
          ✓
        </div>

        <h1 className="mt-6 text-4xl font-black">Transaction Completed</h1>

        <p className="mt-4 text-white/60">
          Your Viltrum order has been created successfully.
        </p>

        <div className="mt-8 rounded-3xl bg-black/30 p-5 text-left">
          <p className="text-white/50">Order ID</p>
          <p className="mt-1 text-2xl font-black">{order}</p>
        </div>

        <div className="mt-4 rounded-3xl bg-black/30 p-5 text-left">
          <p className="text-white/50">Secret Code</p>

          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xl font-black">
              {showSecret ? secret : "•••• •••• ••••"}
            </p>

            <button
              onClick={() => setShowSecret(!showSecret)}
              className="rounded-xl bg-white/10 px-4 py-2 font-bold"
            >
              {showSecret ? "Hide" : "View"}
            </button>
          </div>
        </div>

        <a
          href="/manage-card"
          className="mt-8 inline-block w-full rounded-2xl bg-gradient-to-r from-red-600 to-yellow-400 p-4 font-black text-black"
        >
          Manage Card
        </a>

        <p className="mt-4 text-sm text-white/45">
          Use your secret code to unlock your card dashboard.
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="v-home min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
