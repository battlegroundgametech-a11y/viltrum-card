"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  VAULT_BANK_ADDRESS,
  VAULT_BANK_ABI,
  getCardTypeId
} from "../../lib/vaultBank";
import { useToast } from "../../components/ToastProvider";
import PremiumCard from "../../components/PremiumCard";
import Skeleton from "../../components/Skeleton";
import FreePremiumCard from "../../components/FreePremiumCard";
import PhysicalPremiumCard from "../../components/PhysicalPremiumCard";

export default function ManageCardPage() {
  const [secret, setSecret] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [unlockedCards, setUnlockedCards] = useState<any[]>([]);
  const { showToast } = useToast();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract<any>();

  const cardTypeId = order ? getCardTypeId(order.card_type) : 1;

  const { data: vaultBalance, refetch: refetchBalance } = useReadContract({
  address: VAULT_BANK_ADDRESS,
  abi: VAULT_BANK_ABI,
  functionName: "getBalance",
  args: address && order ? [address, cardTypeId] : undefined
});

  const { data: cardLimits } = useReadContract({
  address: VAULT_BANK_ADDRESS,
  abi: VAULT_BANK_ABI,
  functionName: "cardLimits",
  args: order ? [cardTypeId] : undefined
});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [depositTotal, setDepositTotal] = useState(0);
  const [withdrawTotal, setWithdrawTotal] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  
useEffect(() => {
  const user = localStorage.getItem("viltrum_user");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const isNewUnlock = params.get("new") === "1";

  fetch("/api/manage-card/my-cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      telegram_id: user
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setUnlockedCards(data.cards || []);

        if (!isNewUnlock && data.cards?.length === 1) {
          setOrder(data.cards[0]);
        }
      }
    });

  if (isNewUnlock) {
    setOrder(null);
    setSecret("");
  }
}, []);

  async function unlockCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/manage-card/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret_code: secret
      })
    });

    const data = await res.json();

    if (!data.success) {
      showToast(data.error || "Invalid secret code", "error");
      setLoading(false);
      return;
    }

    setOrder(data.order);

const savedCards = JSON.parse(
  localStorage.getItem("viltrum_unlocked_cards") || "[]"
);

const alreadySaved = savedCards.some(
  (item: any) => item.id === data.order.id
);

const updatedCards = alreadySaved
  ? savedCards
  : [...savedCards, data.order];

localStorage.setItem(
  "viltrum_unlocked_cards",
  JSON.stringify(updatedCards)
);

setUnlockedCards(updatedCards);

localStorage.setItem(
  "viltrum_selected_card",
  JSON.stringify(data.order)
);
    const txRes = await fetch(
  `/api/manage-card/transactions?order_id=${data.order.id}`
);

const txData = await txRes.json();

if (txData.success) {
  const txs = txData.transactions || [];

  setTransactions(txs);

  setDepositTotal(
    txs
      .filter((t: any) => t.type === "deposit")
      .reduce(
        (sum: number, t: any) =>
          sum + Number(t.amount || 0),
        0
      )
  );

  setWithdrawTotal(
    txs
      .filter((t: any) => t.type === "withdraw")
      .reduce(
        (sum: number, t: any) =>
          sum + Number(t.amount || 0),
        0
      )
  );

  setLoadingStats(false);
}

setLoading(false);
  }

  async function depositAction() {
  if (!order || !address) {
    showToast("Connect wallet first.", "error");
    return;
  }

  const amount = prompt("Enter deposit amount in ETH");

  if (!amount) return;

  const depositAmount = parseEther(amount);
  const minDeposit =
    cardLimits && Array.isArray(cardLimits)
      ? (cardLimits[0] as bigint)
      : BigInt(0);

  if (
    order.card_type === "free" &&
    order.status !== "active" &&
    depositAmount < minDeposit
  ) {
    showToast(
  `Minimum deposit required is ${formatEther(minDeposit)} ETH.`,
  "error"
);
    return;
  }

  try {
    await writeContractAsync({
      address: VAULT_BANK_ADDRESS as `0x${string}`,
      abi: VAULT_BANK_ABI as any,
      functionName: "deposit",
      args: [getCardTypeId(order.card_type)],
      value: depositAmount
    } as any);

    if (
  order.card_type === "free" &&
  order.status !== "active"
) {
  const latestBalance =
    vaultBalance ? (vaultBalance as bigint) + depositAmount : depositAmount;

  if (latestBalance < minDeposit) {
    alert(
      `Deposit successful, but activation request was not sent yet.\n\nMinimum required balance is ${formatEther(minDeposit)} ETH.\nYour current deposited balance is ${formatEther(latestBalance)} ETH.`
    );

    refetchBalance();
    setActiveModal("");
    return;
  }

  await fetch(
    "/api/manage-card/free-activation-request",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId: order.id
      })
    }
  );

  showToast(
  "Minimum deposit received. Your activation request has been sent for admin approval.",
  "success"
);

  window.location.reload();
  return;
}

    showToast("Deposit successful.", "success");
    refetchBalance();
    setActiveModal("");
  } catch (err: any) {
    showToast(
  err?.shortMessage || err?.message || "Deposit failed",
  "error"
);
  }
}

  async function withdrawAction() {
  if (!order || !address) {
    alert("Connect wallet first.");
    return;
  }

  const amount = prompt("Enter withdrawal amount in ETH");

  if (!amount) return;

  try {
    await writeContractAsync({
  address: VAULT_BANK_ADDRESS as `0x${string}`,
  abi: VAULT_BANK_ABI as any,
  functionName: "withdraw",
  args: [getCardTypeId(order.card_type), parseEther(amount)]
} as any);

    showToast("Withdrawal successful.", "success");
    refetchBalance();
    setActiveModal("");
  } catch (err: any) {
    showToast(
  err?.shortMessage || err?.message || "Withdrawal failed",
  "error"
);
  }
}

  if (!order) {
  return (
    <main className="manage-page">
      <HamburgerMenu />

      <div className="manage-unlock">
        <div className="manage-unlock-card">
          <p className="manage-eyebrow">Viltrum Secure Access</p>
          <h1>Unlock New Card</h1>
          <p>Enter your secret code once to add this card to your dashboard.</p>

          <form onSubmit={unlockCard}>
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter Secret Code"
              required
            />

            <button disabled={loading}>
              {loading ? "Checking..." : "Unlock Card"}
            </button>
          </form>
        </div>
      </div>

      {unlockedCards.length > 0 && (
        <div className="manage-unlock">
          <div className="manage-unlock-card">
            <p className="manage-eyebrow">Viltrum Cards</p>
            <h1>Your Cards</h1>
            <p>Select a card to manage or unlock a new card below.</p>

            <div className="manage-card-list">
              {unlockedCards.map((card: any) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setOrder(card);
                    localStorage.setItem(
                      "viltrum_selected_card",
                      JSON.stringify(card)
                    );
                  }}
                  className="manage-card-list-item"
                >
                  <span className="manage-card-type">
  {card.card_type === "virtual" && "Virtual"}
  {card.card_type === "physical" && "Physical"}
  {card.card_type === "free" && "Free Mint"}
</span>
                  <b>
  {card.card_type === "virtual" && "Virtual Card"}
  {card.card_type === "physical" && "Physical Card"}
  {card.card_type === "free" && "Free Mint Card"}
</b>

<em className="manage-card-visa">VISA</em>
                  <small>{card.status}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

  const isFree = order.card_type === "free";
  const isPhysical = order.card_type === "physical";
  const isVirtual = order.card_type === "virtual";
  const isInactiveFree = isFree && order.status !== "active";

  const maskedNumber =
    "**** **** **** " + String(order.card_number || "0000").slice(-4);

  return (
    <main className="manage-page">
      <HamburgerMenu />
      <WalletBadge />

      <section className="manage-header">
        <button
  onClick={() => {
    setOrder(null);
    setShowDetails(false);
    setActiveModal("");
  }}
  className="manage-back-btn"
>
  ← Back to My Cards
</button>
        <p>Viltrum Banking Console</p>
        <h1>Manage My Card</h1>
        <span>Private card controls secured by your secret code.</span>
      </section>

      <section className="manage-bank-layout">
        <div className="manage-card-panel">
  {isVirtual ? (
  <PremiumCard
    variant="virtual"
    title="Virtual Card"
    number={
      showDetails && order.card_number
        ? order.card_number
        : maskedNumber
    }
    holder={order.full_name || "Card Holder"}
    expiry={
      showDetails && order.card_exp
        ? order.card_exp
        : "**/**"
    }
    status={
      order.status
        ? order.status.toUpperCase()
        : "ACTIVE"
    }
  />
) : isFree ? (
  <FreePremiumCard
    number={
      showDetails && order.card_number
        ? order.card_number
        : maskedNumber
    }
    holder={order.full_name || "Card Holder"}
    expiry={
      showDetails && order.card_exp
        ? order.card_exp
        : "**/**"
    }
    blurred={isInactiveFree}
  />
) : (
  <div
    className={`manage-card ${
      isInactiveFree ? "manage-card-blur" : ""
    }`}
  >
    <div className="manage-card-top">
      <span>VILTRUM</span>
      <small>{order.status || "active"}</small>
    </div>

    <h2>
      {isPhysical && "Physical Card"}
      {isFree && "Free Mint Card"}
    </h2>

    <p className="manage-card-number">
      {showDetails && order.card_number
        ? order.card_number
        : maskedNumber}
    </p>

    <div className="manage-card-bottom">
      <b>{order.full_name || "Card Holder"}</b>

      <b>
        {showDetails && order.card_exp
          ? order.card_exp
          : "**/**"}
      </b>
    </div>

    {isInactiveFree && (
      <div className="inactive-card-label">
        INACTIVE
      </div>
    )}
  </div>
)}

          {isPhysical && (
            <div className="manage-status-box">
              <h2>
                {order.status === "active"
                  ? "Card Approved"
                  : "Card Request Submitted"}
              </h2>
              <p>
                {order.status === "active"
                  ? "Dispatching soon."
                  : "Your physical card request has been submitted."}
              </p>
            </div>
          )}

          {isFree && (
            <div className="manage-status-box">
              <h2>
                {order.status === "active"
                  ? "Free Card Active"
                  : "Card Inactive"}
              </h2>
              <p>
                {order.status === "active"
                  ? "Your free mint card is active and ready."
                  : "Deposit the minimum required balance to activate this card."}
              </p>
            </div>
          )}
        </div>

        <div className="manage-money-panel">
  <p>Current Balance</p>

  {vaultBalance === undefined ? (
    <Skeleton className="skeleton-line" />
  ) : (
    <h2>{formatEther(vaultBalance as bigint)} ETH</h2>
  )}

  <span>Vault contract balance will appear here.</span>

  <div className="manage-mini-stats">

  <div>
    <small>Total Deposits</small>

    {loadingStats ? (
      <Skeleton className="skeleton-line" />
    ) : (
      <b>{depositTotal.toFixed(4)} ETH</b>
    )}
  </div>

  <div>
    <small>Total Withdrawals</small>

    {loadingStats ? (
      <Skeleton className="skeleton-line" />
    ) : (
      <b>{withdrawTotal.toFixed(4)} ETH</b>
    )}
  </div>

</div>
        </div>
      </section>

      <section className="manage-actions">
  {!(isFree && order.status !== "active") && (
    <button onClick={() => setShowDetails(!showDetails)}>
      {showDetails ? "Hide Details" : "Card Details"}
    </button>
  )}

  <button onClick={() => setActiveModal("deposit")}>
    Deposit
  </button>

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("withdraw")}>
      Withdraw
    </button>
  )}

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("balance")}>
      Check Balance
    </button>
  )}

  {!(isFree && order.status !== "active") && (
    <button onClick={() => setActiveModal("transactions")}>
      Transaction History
    </button>
  )}

  {isPhysical && (
    <button onClick={() => setActiveModal("shipment")}>
      Track Shipment
    </button>
  )}

  <button onClick={() => setActiveModal("support")}>
    Help & Support
  </button>
</section>

     {activeModal && (
  <div className="manage-modal-backdrop">
    <div className="manage-modal">
      <button
        className="manage-modal-close"
        onClick={() => setActiveModal("")}
      >
        ×
      </button>

      {activeModal === "deposit" && (
        <>
          <h2>Deposit</h2>
          <p>
            Deposits will connect to your Viltrum vault contract.
          </p>

          {isFree && order.status !== "active" && (
            <div className="manage-modal-note">
              Deposit request received. Please wait up to 2 hours while your
              activation request is verified and processed.
            </div>
          )}

          <button onClick={depositAction}>
  Deposit Now
</button>
        </>
      )}

      {activeModal === "withdraw" && (
        <>
          <h2>Withdraw</h2>
          <p>
            Withdrawals will connect to your Viltrum vault contract.
          </p>
          <button onClick={withdrawAction}>
  Withdraw Now
</button>
          
        </>
      )}

      {activeModal === "balance" && (
        <>
          <h2>Card Balance</h2>
          <p className="manage-modal-balance">
  {vaultBalance
    ? `${formatEther(vaultBalance as bigint)} ETH`
    : "0 ETH"}
</p>
          <span>Vault contract balance will appear here.</span>
        </>
      )}

      {activeModal === "transactions" && (
  <>
    <h2>Transaction History</h2>

    {transactions.length === 0 ? (
      <div className="manage-tx-empty">
        No transactions yet.
      </div>
    ) : (
      <div className="manage-tx-list">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="manage-tx-item"
          >
            <div>
              <b>{tx.type}</b>
              <p>{tx.status}</p>
            </div>

            <div>
              ${tx.amount}
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}

      {activeModal === "shipment" && (
        <>
          <h2>Shipment Tracking</h2>
          <p>
            <b>Status:</b> {order.shipment_status || "Not started"}
          </p>
          <p>
            {order.tracking_note ||
              "Tracking details will appear here once available."}
          </p>
        </>
      )}

      {activeModal === "support" && (
        <>
          <h2>Help & Support</h2>
          <p>
            For support, contact the Viltrum support team with your Order ID.
          </p>
          <div className="manage-modal-note">
            Order ID: {order.order_id}
          </div>
        </>
      )}
    </div>
  </div>
)}
      
      {showDetails && (
        <section className="manage-details">
          <h2>Card Details</h2>

          <div className="manage-detail-grid">
            <p>
              <span>Card Number</span>
              <b>{order.card_number || "Not assigned"}</b>
            </p>

            <p>
              <span>Expiry</span>
              <b>{order.card_exp || "Not assigned"}</b>
            </p>

            <p>
              <span>CVV</span>
              <b>{order.card_cvv || "***"}</b>
            </p>

            <p>
              <span>Status</span>
              <b>{order.status}</b>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
