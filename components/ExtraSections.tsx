export default function ExtraSections() {
  return (
    <>
      <section className="extra-stats">
        <div className="extra-stat"><b>10K+</b><span>Cards Created</span></div>
        <div className="extra-stat"><b>$1.2M+</b><span>Demo Volume</span></div>
        <div className="extra-stat"><b>150+</b><span>Countries Ready</span></div>
        <div className="extra-stat"><b>99.9%</b><span>System Uptime</span></div>
      </section>

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

      <section className="extra-showcase">
        <div>
          <p className="extra-label left">Physical Card Preview</p>
          <h2>Designed for a premium future card experience</h2>
          <p>
            Physical card buyers receive shipment tracking inside the Telegram bot.
            You can manually update shipment status from the admin dashboard.
          </p>
        </div>

        <div className="showcase-cards">
          <div className="show-card show-one">FRONT</div>
          <div className="show-card show-two">BACK</div>
          <div className="show-card show-three">ANGLED</div>
        </div>
      </section>

      <section className="extra-security">
        <p className="extra-label">Security Layer</p>
        <h2>Built around verification and controlled access</h2>

        <div className="security-grid">
          <div>Telegram Authentication</div>
          <div>Wallet Verification</div>
          <div>NFT Ownership Proof</div>
          <div>Supabase Data Layer</div>
          <div>Admin Reload Limits</div>
          <div>Admin Withdraw Limits</div>
        </div>
      </section>

      <section className="extra-roadmap">
        <p className="extra-label">Roadmap</p>
        <h2>Viltrum development path</h2>

        <div className="roadmap-grid">
          <div><b>Q3</b><span>Virtual Cards</span></div>
          <div><b>Q4</b><span>Physical Orders</span></div>
          <div><b>Q1</b><span>Rewards System</span></div>
          <div><b>Q2</b><span>Expanded Vault Controls</span></div>
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
        <small>© 2025 Viltrum. Testing version.</small>
      </footer>
    </>
  );
}
