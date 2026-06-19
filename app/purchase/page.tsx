export default function PurchasePage() {
  return (
    <main className="purchase-premium">
      <section className="purchase-hero">
        <p className="purchase-label">Viltrum Access Tiers</p>
        <h1>Choose your card</h1>
        <p>
          Select a Viltrum card type to continue. After choosing, you will enter
          your required details and complete the order flow.
        </p>
      </section>

      <section className="purchase-grid">
        <a href="/checkout/virtual" className="purchase-option">
          <div className="purchase-card virtual-card">
            <span>VILTRUM</span>
            <b>Virtual</b>
            <p>4242 4242 4242 1201</p>
          </div>

          <h2>Virtual Card</h2>
          <h3>$5</h3>
          <p>
            Includes virtual card and NFT. First 1000 buyers receive a $5 card
            bonus.
          </p>
          <button>Purchase Virtual</button>
        </a>

        <a href="/checkout/physical" className="purchase-option featured-option">
          <div className="purchase-card physical-card">
            <span>VILTRUM</span>
            <b>Physical</b>
            <p>4242 4242 4242 6060</p>
          </div>

          <h2>Physical Card</h2>
          <h3>$60</h3>
          <p>
            Includes $15 bonus, virtual card access, NFT, future physical card,
            and shipment tracking.
          </p>
          <button>Purchase Physical</button>
        </a>

        <a href="/checkout/free" className="purchase-option">
          <div className="purchase-card free-card">
            <span>VILTRUM</span>
            <b>Free Mint</b>
            <p>4242 4242 4242 0000</p>
          </div>

          <h2>Free Mint</h2>
          <h3>Free</h3>
          <p>
            Includes inactive card and NFT. Activate after minimum reload set by
            admin.
          </p>
          <button>Mint Free</button>
        </a>
      </section>
    </main>
  );
}
