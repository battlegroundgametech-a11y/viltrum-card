"use client";

interface PhysicalPremiumCardProps {
  number: string;
  holder: string;
  expiry?: string;
}

export default function PhysicalPremiumCard({
  number,
  holder,
  expiry = "**/**"
}: PhysicalPremiumCardProps) {
  return (
    <div className="physical-premium-card">
      <div className="physical-card-bg-mark">P</div>
      <div className="physical-card-light" />

      <div className="physical-card-header">
        <div className="physical-card-brand">
          <span className="physical-card-logo">V</span>
          <span>VILTRUM</span>
        </div>

        <div className="physical-card-type">
          PHYSICAL CARD
        </div>
      </div>

      <div className="physical-card-chip">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="physical-card-number">
        {number}
      </div>

      <div className="physical-card-bottom">
        <div>
          <small>Card Holder</small>
          <b>{holder}</b>
        </div>

        <div>
          <small>Valid Thru</small>
          <b>{expiry}</b>
        </div>
      </div>

      <div className="physical-card-visa">
        <strong>VISA</strong>
        <span>Signature</span>
      </div>
    </div>
  );
}
