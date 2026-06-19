import HamburgerMenu from "../components/HamburgerMenu";
import HeroCard from "../components/HeroCard";

export default function HomePage() {
  return (
    <main className="v-home">
      <div className="cursor-glow" />
      <HamburgerMenu />

      <section className="v-hero">
        <div>
          <div className="v-kicker">
            Sepolia Demo • Telegram Login • RainbowKit Wallet
          </div>

          <h1 className="v-title">
            Command your
            <span>crypto card stack</span>
          </h1>

          <p className="v-desc">
            Viltrum delivers a premium finance-grade crypto card experience with
            virtual cards, physical card orders, free mint access, NFT ownership,
            reload controls, withdrawals, rewards, and Telegram verification.
          </p>

          <div className="v-actions">
            <a href="/login" className="v-primary">Sign Up</a>
            <a href="#cards" className="v-secondary">Explore Cards</a>
          </div>

          <div className="v-stats">
            <div className="v-stat">
              <b>$5</b>
              <p>Virtual card</p>
            </div>
            <div className="v-stat">
              <b>$60</b>
              <p>Physical card</p>
            </div>
            <div className="v-stat">
              <b>Free</b>
              <p>Inactive mint</p>
            </div>
          </div>
        </div>

        <HeroCard />
      </section>

      <section id="cards" className="v-products">
        <p className="v-section-tag">Card Collection</p>
        <h2>Choose your Viltrum Card</h2>

        <div className="v-product-grid">
          <a href="/checkout/virtual" className="v-product">
            <small>01 • VIRTUAL</small>
            <h3>Virtual Card</h3>
            <p>$5 demo card with NFT ownership. First 1000 buyers receive a $5 bonus.</p>
          </a>

          <a href="/checkout/physical" className="v-product v-product-hot">
            <small>02 • PHYSICAL</small>
            <h3>Physical Card</h3>
            <p>$60 premium order with $15 bonus, virtual card access, NFT, and shipment tracking.</p>
          </a>

          <a href="/checkout/free" className="v-product">
            <small>03 • FREE MINT</small>
            <h3>Free Mint</h3>
            <p>Free inactive card with NFT. Activate after minimum reload set by admin.</p>
          </a>
        </div>
      </section>

      <section className="v-dashboard-section">
        <div className="v-dashboard">
          <div>
            <p className="v-section-tag">Vault Dashboard</p>
            <h2>Control reloads, withdrawals, status and rewards.</h2>
          </div>

          <div className="v-dashboard-grid">
            <div className="v-dash-box">
              <span>Balance</span>
              <b>$150.00</b>
            </div>
            <div className="v-dash-box">
              <span>NFT Status</span>
              <b>Verified</b>
            </div>
            <div className="v-dash-box">
              <span>Card Status</span>
              <b>Active</b>
            </div>
            <div className="v-dash-box">
              <span>Shipment</span>
              <b>Manual Track</b>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
