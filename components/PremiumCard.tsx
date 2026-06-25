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
  status = "ACTIVE",
  variant = "virtual",
  blurred = false
}: PremiumCardProps) {
  return (
    <div
      className={`premium-card ${variant} ${
        blurred ? "premium-card-blurred" : ""
      }`}
    >
      <div className="premium-card-shine" />

      <div className="premium-card-top">
        <div className="premium-chip" />

        <div className="premium-contactless">
          )))
        </div>
      </div>

      <div className="premium-brand">
        VILTRUM
      </div>

      <div className="premium-title">
        {title}
      </div>

      <div className="premium-number">
        {number}
      </div>

      <div className="premium-bottom">

        <div>
          <small>Card Holder</small>
          <b>{holder}</b>
        </div>

        <div>
          <small>Expires</small>
          <b>{expiry}</b>
        </div>

      </div>

      <div className="premium-status">
        {status}
      </div>
    </div>
  );
}
