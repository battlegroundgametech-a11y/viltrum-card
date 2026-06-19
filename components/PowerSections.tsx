export default function PowerSections() {
  return (
    <>
      <section className="power-ticker">
        <div>
          NFT VERIFIED • TELEGRAM VERIFIED • SEPOLIA READY • VAULT ENABLED • WALLET CONNECTED • CARD STACK ACTIVE •
        </div>
      </section>

      <section className="power-dashboard">
        <div className="power-copy">
          <p>Live Command Center</p>
          <h2>Everything controlled from one premium vault layer.</h2>
        </div>

        <div className="dash-panel">
          <div className="dash-top">
            <span>Viltrum Vault</span>
            <b>Online</b>
          </div>

          <div className="dash-balance">
            <span>Total Demo Balance</span>
            <h3>$24,950.42</h3>
          </div>

          <div className="dash-chart">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>

          <div className="dash-grid">
            <div><b>4,921</b><span>NFTs Minted</span></div>
            <div><b>783</b><span>Physical Orders</span></div>
            <div><b>99.9%</b><span>Uptime</span></div>
            <div><b>24/7</b><span>Verification</span></div>
          </div>
        </div>
      </section>

      <section className="power-flow">
        <p>How It Works</p>
        <h2>From verification to card ownership</h2>

        <div className="flow-line">
          {["Telegram Login", "Wallet Connect", "Choose Card", "Mint NFT", "Bot Verification", "Vault Control"].map((item, i) => (
            <div className="flow-step" key={item}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="power-prestige">
        <div><b>3</b><span>Card Types</span></div>
        <div><b>$5</b><span>Virtual Entry</span></div>
        <div><b>$15</b><span>Physical Bonus</span></div>
        <div><b>100%</b><span>NFT Proof</span></div>
      </section>
    </>
  );
}
