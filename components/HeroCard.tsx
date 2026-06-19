"use client";

export default function HeroCard() {
  return (
    <div className="premium-card-wrap w-full max-w-[340px] sm:max-w-[430px] lg:max-w-[500px]">
      <div className="premium-card">
        <div className="card-bg" />
        <div className="card-orb card-orb-one" />
        <div className="card-orb card-orb-two" />
        <div className="card-chip" />

        <div className="card-top">
          <div>
            <p className="card-brand">VILTRUM</p>
            <h3 className="card-title">Crypto Card</h3>
          </div>

          <div className="card-logo">
            <span>V</span>
          </div>
        </div>

        <div className="card-middle">
          <p className="card-number">4242 4242 4242 1234</p>
          <p className="card-network">SEPOLIA DEMO CARD</p>
        </div>

        <div className="card-bottom">
          <div>
            <p className="card-label">CARD HOLDER</p>
            <p className="card-value">SATOSHI NAKAMOTO</p>
          </div>

          <div>
            <p className="card-label">CVV</p>
            <p className="card-value">123</p>
          </div>

          <div>
            <p className="card-label">EXP</p>
            <p className="card-value">12/30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
