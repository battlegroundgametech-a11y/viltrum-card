export default function ExtraSections() {
  return (
    <>

      <section className="extra-timeline">
        <p className="extra-label">Viltrum Flow</p>
        <h2>From login to card ownership</h2>

        <div className="timeline-grid">
          {["Telegram Login", "Wallet Connect", "Card Mint", "Reload", "Withdraw", "NFT Ownership"].map((item, i) => (
            <div className="timeline-step" key={item}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="extra-comparison">
        <p className="extra-label">Card Plans</p>
        <h2>Compare every access tier</h2>

        <div className="comparison-table">
          <div className="row head"><span>Feature</span><span>Free</span><span>Virtual</span><span>Physical</span></div>
          <div className="row"><span>NFT Ownership</span><span>✓</span><span>✓</span><span>✓</span></div>
          <div className="row"><span>Purchase Bonus</span><span>—</span><span>$5</span><span>$15</span></div>
          <div className="row"><span>Reload</span><span>After activation</span><span>✓</span><span>✓</span></div>
          <div className="row"><span>Withdraw</span><span>After activation</span><span>✓</span><span>✓</span></div>
          <div className="row"><span>Shipment Tracking</span><span>—</span><span>—</span><span>✓</span></div>
        </div>
      </section>

      <section className="extra-showcase premium-device-section">
  <div className="device-copy">
    <p className="extra-label left">Physical Card Preview</p>
    <h2>Crypto cards built for a premium wallet experience</h2>
    <p>
      A modern card interface designed for virtual access, future physical
      delivery, Telegram tracking, vault controls, reloads, withdrawals, and NFT
      ownership proof.
    </p>

    <div className="device-points">
      <span>Shipment tracking</span>
      <span>Vault controls</span>
      <span>NFT verified</span>
    </div>
  </div>

    <div className="floating-card card-front">
      <span>VILTRUM</span>
      <b>Sovereign Black</b>
    </div>

    <div className="floating-card card-back">
      <div className="mag-strip" />
      <span>VAULT READY</span>
    </div>

    <div className="floating-card card-gold-side">
      <span>NFT VERIFIED</span>
    </div>
  </div>
</section>

      <section className="extra-faq">
        <p className="extra-label">FAQ</p>
        <h2>Common questions</h2>

        <details><summary>How do I mint a card?</summary><p>Sign up with Telegram, connect your wallet, choose a card, and complete the order flow.</p></details>
        <details><summary>Do physical buyers get tracking?</summary><p>Yes. Physical card buyers see Track Shipment inside the Telegram bot.</p></details>
        <details><summary>Are free mint cards active?</summary><p>No. Free mint cards remain inactive until the minimum reload amount is completed.</p></details>
        <details><summary>Where is card data stored?</summary><p>Demo card and order data are stored in Supabase.</p></details>
      </section>

      <footer className="extra-footer">
        <h2>Viltrum</h2>
        <p>Premium crypto card experience on Sepolia testnet.</p>
        <div>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Sign Up</a>
          <a href="#cards">Cards</a>
        </div>
        <small>© 2026 Viltrum.</small>
      </footer>
    </>
  );
}
