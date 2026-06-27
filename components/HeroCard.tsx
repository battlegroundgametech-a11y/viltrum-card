"use client";

export default function HeroCard() {
  return (
    <div className="elite-stack">
      <div className="elite-back-card card-red">
        <span>CRIMSON</span>
      </div>

      <div className="elite-back-card card-gold">
        <span>AUREUS</span>
      </div>

      <div className="elite-main-card">
        <div className="elite-card-shine" />

        <div className="elite-card-top">
          <div>
            <p>VILTRUM</p>
            <h3>Sovereign Black</h3>
          </div>
          <div className="elite-chip" />
        </div>

        <div className="elite-card-center">
          <p className="elite-number">4242 4242 4242 1234</p>
        </div>

        <div className="elite-card-bottom">
          <div>
            <span>CARD HOLDER</span>
            <b>SATOSHI NAKAMOTO</b>
          </div>

          <div>
            <span>CVV</span>
            <b>123</b>
          </div>

          <div>
            <span>EXP</span>
            <b>12/30</b>
          </div>
        </div>
      </div>
    </div>
  );
}
