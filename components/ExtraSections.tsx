export default function ExtraSections() {
  return (
    <>

        <section className="extra-faq">
        <p className="extra-label">FAQ</p>
        <h2>Common questions</h2>

        <details><summary>How do I mint a card?</summary><p>Sign up with Telegram, connect your wallet, choose a card, and complete the order flow.</p></details>
        <details><summary>Do physical buyers get tracking?</summary><p>Yes. Physical card buyers see Track Shipment inside Manage card.</p></details>
        <details><summary>Are free mint cards active?</summary><p>No. Free mint cards remain inactive until the minimum reload amount is completed.</p></details>
        <details><summary>Where is card data stored?</summary><p>Card and order data are stored in Supabase.</p></details>
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
