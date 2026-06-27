import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";
import ExtraSections from "../components/ExtraSections";
import PowerSections from "../components/PowerSections";
import FinalPolish from "../components/FinalPolish";
import WalletBadge from "../components/WalletBadge";

export default function HomePage() {
  return (
    <main className="elite-home">
      <HamburgerMenu />
      <WalletBadge />

      <section className="elite-hero">
        <div className="elite-bg-grid" />
        <div className="elite-red-orb" />
        <div className="elite-gold-orb" />

        <div className="elite-card-area">
          <HeroCard />
        </div>

        <div className="elite-copy">
          <div className="elite-kicker">
            SEPOLIA TESTNET • TELEGRAM VERIFIED • WALLET READY
          </div>

          <h1 className="elite-title">
            Spend Crypto with
            <span>Confidence</span>
          </h1>

          <p className="elite-desc">
            Viltrum Card brings together secure blockchain technology and premium financial
            services in one seamless experience. Instantly connect your wallet, 
            own your card as an NFT, manage your funds with confidence, 
            and enjoy a modern payment ecosystem designed for the next generation of digital finance.
          </p>

          <div className="elite-actions">
            <a href="/signup" className="elite-primary">Sign Up</a>
            <a href="#cards" className="elite-secondary">Explore Cards</a>
            </div>
          </div>
        </div>
      </section>
      <PowerSections />

         <section className="extra-comparison">
        <p className="extra-label">Card Plans</p>
        <h2>Compare every access tier</h2>

        <div className="comparison-table">
          <div className="row head"><span>Feature</span><span>Free</span><span>Virtual</span><span>Physical</span></div>
          <div className="row"><span>NFT Ownership</span><span>✓</span><span>—</span><span>—</span></div>
          <div className="row"><span>Purchase Discount</span><span>—</span><span>$5</span><span>—</span></div>
          <div className="row"><span>Purchase Bonus</span><span>—</span><span>$5</span><span>$15</span></div>
          <div className="row"><span>Reload</span><span>After activation</span><span>✓</span><span>✓</span></div>
          <div className="row"><span>Withdraw</span><span>After activation</span><span>✓</span><span>✓</span></div>
          <div className="row"><span>Shipment Tracking</span><span>—</span><span>—</span><span>✓</span></div>
        </div>
      </section>

       <section id="cards" className="elite-products">
        <p className="elite-section-label">Viltrum Card Collection</p>
        <h2>Choose your access tier</h2>

        <div className="elite-product-grid">
          <a href="/checkout/virtual" className="elite-product">
            <small>01 • VIRTUAL ACCESS</small>
            <h3>Virtual Card</h3>
            <p>$10 card ownership. Also receive a $5 discount.</p>
          </a>

          <a href="/checkout/physical" className="elite-product elite-featured">
            <small>02 • PREMIUM ORDER</small>
            <h3>Physical Card</h3>
            <p>$60 card with $15 bonus, virtual access and shipment tracking.</p>
          </a>

          <a href="/checkout/free" className="elite-product">
            <small>03 • FREE MINT</small>
            <h3>Free Mint</h3>
            <p>Free inactive card and NFT.</p>
          </a>
        </div>
      </section>
     <ExtraSections />
    <FinalPolish />
    </main>
  );
}
