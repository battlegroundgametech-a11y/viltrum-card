export default function FinalPolish() {
  return (
    <>
      <section className="polish-stats">
        <div><b>12K+</b><span>Cards Issued</span></div>
        <div><b>$2.4M+</b><span>Demo Volume</span></div>
        <div><b>98.7%</b><span>Success Rate</span></div>
        <div><b>24/7</b><span>Access Layer</span></div>
      </section>

      <section className="polish-roadmap">
        <p>Roadmap</p>
        <h2>Building the Viltrum ecosystem</h2>

        <div className="polish-road-grid">
          <div><b>01</b><h3>Virtual Cards</h3><span>Demo card issuing and NFT access.</span></div>
          <div><b>02</b><h3>Vault Controls</h3><span>Reload and withdraw limit management.</span></div>
          <div><b>03</b><h3>Physical Orders</h3><span>Manual shipment tracking through Telegram.</span></div>
          <div><b>04</b><h3>Rewards Layer</h3><span>Bonuses, activation rules and premium perks.</span></div>
        </div>
      </section>

      <footer className="polish-footer">
        <h2>Viltrum Card</h2>
        <p>Premium crypto card experience on Sepolia testnet.</p>

        <div>
          <a href="/">Home</a>
          <a href="/login">Sign Up</a>
          <a href="/dashboard">Dashboard</a>
          <a href="#cards">Cards</a>
        </div>

        <small>© 2025 Viltrum. Testing version.</small>
      </footer>
    </>
  );
}
