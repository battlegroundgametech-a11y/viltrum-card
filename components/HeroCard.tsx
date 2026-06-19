"use client";

export default function HeroCard() {
  return (
    <div className="card-3d-wrap w-full max-w-[350px] sm:max-w-[440px] lg:max-w-[520px]">
      <div className="premium-v-card">
        <div className="card-content">
          <div className="card-row">
            <div>
              <p className="card-brand">VILTRUM</p>
              <h3 className="card-title">Crypto Black</h3>
            </div>

            <div className="card-chip" />
          </div>

          <p className="card-number">4242 4242 4242 1234</p>
          <p className="card-mini">SEPOLIA DEMO • NFT VERIFIED • VAULT READY</p>

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
    </div>
  );
}
