"use client";

interface PremiumCardProps {
  title: string;
  number: string;
  holder: string;
  expiry?: string;
  status?: string;
  variant?: "virtual" | "physical" | "free";
  blurred?: boolean;
}

export default function PremiumCard({
  title,
  number,
  holder,
  expiry = "**/**",
  variant = "virtual",
  blurred = false
}: PremiumCardProps) {
  const displayNumber = number || "**** **** **** 0000";

  return (
    <div
      className={`premium-card luxury-virtual-card ${variant} ${
        blurred ? "premium-card-blurred" : ""
      }`}
    >
      <div className="lux-card-bg-mark">V</div>
      <div className="lux-card-light" />
      <div className="lux-card-line lux-card-line-one" />
      <div className="lux-card-line lux-card-line-two" />

      <div className="lux-card-header">
        <div className="lux-brand">
          <span className="lux-brand-mark">V</span>
          <span>VILTRUM</span>
        </div>

        <div className="lux-card-type">
          {title}
        </div>
      </div>

      <div className="lux-chip">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="lux-card-number">
        {displayNumber}
      </div>

      <div className="lux-card-meta">
        <div>
          <small>Card Holder</small>
          <b>{holder}</b>
        </div>

        <div>
          <small>Valid Thru</small>
          <b>{expiry}</b>
        </div>
      </div>

      <div className="lux-visa">
        <strong>VISA</strong>
        <span>SIGNATURE</span>
      </div>
    </div>
  );
}
