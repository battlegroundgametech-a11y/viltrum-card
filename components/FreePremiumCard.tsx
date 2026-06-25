"use client";

interface FreePremiumCardProps {
  number: string;
  holder: string;
  expiry?: string;
  blurred?: boolean;
}

export default function FreePremiumCard({
  number,
  holder,
  expiry = "**/**",
  blurred = false
}: FreePremiumCardProps) {
  return (
    <div className={`free-premium-card ${blurred ? "free-premium-card-locked" : ""}`}>
      <div className="free-card-bg-mark">F</div>
      <div className="free-card-light" />

      <div className="free-card-header">
        <div className="free-card-brand">
          <span className="free-card-logo">V</span>
          <span>VILTRUM</span>
        </div>

        <div className="free-card-type">
          FREE MINT
        </div>
      </div>

      <div className="free-card-chip">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="free-card-number">
        {number}
      </div>

      <div className="free-card-bottom">
        <div>
          <small>Card Holder</small>
          <b>{holder}</b>
        </div>

        <div>
          <small>Valid Thru</small>
          <b>{expiry}</b>
        </div>
      </div>

      <div className="free-card-visa">
        <strong>VISA</strong>
        <span>Signature</span>
      </div>
    </div>
  );
}
