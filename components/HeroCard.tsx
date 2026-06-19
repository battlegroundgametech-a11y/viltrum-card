"use client";

export default function HeroCard() {
  return (
    <div className="v-card-stage">
      <div className="v-orbit" />

      <div className="v-card">
        <div className="v-card-inner">
          <div className="v-card-top">
            <div>
              <p className="v-brand">VILTRUM</p>
              <h3>Vault Black</h3>
            </div>

            <div className="v-chip" />
          </div>

          <div className="v-card-mid">
            <p className="v-number">4242 4242 4242 1234</p>
            <p className="v-tag">NFT VERIFIED • SEPOLIA • VAULT READY</p>
          </div>

          <div className="v-card-bottom">
            <div>
              <p className="v-label">CARD HOLDER</p>
              <p className="v-value">SATOSHI NAKAMOTO</p>
            </div>

            <div>
              <p className="v-label">CVV</p>
              <p className="v-value">123</p>
            </div>

            <div>
              <p className="v-label">EXP</p>
              <p className="v-value">12/30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
