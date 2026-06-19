import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="elite-home">
      <HamburgerMenu />

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
            Elite crypto
            <span>card command</span>
          </h1>

          <p className="elite-desc">
            Viltrum brings a premium finance-grade crypto card experience with
            NFT ownership, virtual cards, future physical cards, reload controls,
            withdrawals, bonuses, and Telegram-based access.
          </p>

          <div className="elite-actions">
            <a href="/login" className="elite-primary">Sign Up</a>
            <a href="#cards" className="elite-secondary">Explore Cards</a>
          </div>

          <div className="elite-metrics">
            <div>
              <b>$5</b>
              <span>Virtual Card</span>
            </div>
            <div>
              <b>$60</b>
              <span>Physical Card</span>
            </div>
            <div>
              <b>Free</b>
              <span>Inactive Mint</span>
            </div>
          </div>
        </div>
      </section>

      <section id="cards" className="elite-products">
        <p className="elite-section-label">Viltrum Card Collection</p>
        <h2>Choose your access tier</h2>

        <div className="elite-product-grid">
          <a href="/checkout/virtual" className="elite-product">
            <small>01 • VIRTUAL ACCESS</small>
            <h3>Virtual Card</h3>
            <p>$5 demo card with NFT ownership. First 1000 buyers receive a $5 bonus.</p>
          </a>

          <a href="/checkout/physical" className="elite-product elite-featured">
            <small>02 • PREMIUM ORDER</small>
            <h3>Physical Card</h3>
            <p>$60 card with $15 bonus, virtual access, NFT, and shipment tracking.</p>
          </a>

          <a href="/checkout/free" className="elite-product">
            <small>03 • FREE MINT</small>
            <h3>Free Mint</h3>
            <p>Free inactive card and NFT. Activate after minimum reload set by admin.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
