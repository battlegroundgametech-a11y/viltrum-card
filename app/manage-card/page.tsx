"use client";

import { useEffect, useState } from "react";
import HamburgerMenu from "../../components/HamburgerMenu";
import WalletBadge from "../../components/WalletBadge";
import {
  useAccount,
  useReadContract,
  useWriteContract
} from "wagmi";
import { formatEther } from "viem";
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
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  HelpCircle,
  PackageSearch,
  Copy,
  Gift,
  X
} from "lucide-react";

export default function ManageCardPage() {
  const [secret, setSecret] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [unlockedCards, setUnlockedCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [vaultBalanceUsd, setVaultBalanceUsd] = useState("$0.00");

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

  const { data: depositLimits } = useReadContract({
  address: VAULT_BANK_ADDRESS,
  abi: VAULT_BANK_ABI,
  functionName: "getDepositWeiLimits",
  args: order ? [cardTypeId] : undefined
});

  useEffect(() => {
  async function convertBalance() {
    if (vaultBalance === undefined || vaultBalance === null) {
      setVaultBalanceUsd("$0.00");
      return;
    }

    const weiValue = BigInt(vaultBalance as bigint);

    if (weiValue === BigInt(0)) {
      setVaultBalanceUsd("$0.00");
      return;
    }

    const res = await fetch("/api/convert-wei", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wei: weiValue.toString()
      })
    });

    const data = await res.json();

    if (data.success) {
      setVaultBalanceUsd(
        `$${(Number(data.usdCents) / 100).toFixed(2)}`
      );
    } else {
      setVaultBalanceUsd("$0.00");
    }
  }

  convertBalance();
}, [vaultBalance, address, cardTypeId]);

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
            loadTransactions(data.cards[0]);
          }
        }
      });

    if (isNewUnlock) {
      setOrder(null);
      setSecret("");
    }
  }, []);

  async function loadTransactions(selectedOrder: any) {
    const txRes = await fetch(
      `/api/manage-card/transactions?order_id=${selectedOrder.id}`
    );

    const txData = await txRes.json();

    if (txData.success) {
      setTransactions(txData.transactions || []);
    }
  }

  function formatUSD(value: any) {
    const num = Number(value || 0);
    return `$${num.toFixed(2)}`;
  }

  function formatVaultUSD(value: any) {
    if (!value) return "$0.00";
    return `$${Number(formatEther(value as bigint)).toFixed(2)}`;
  }

  async function copyOrderId() {
    try {
      await navigator.clipboard.writeText(String(order.order_id || ""));
      showToast("Order ID copied.", "success");
    } catch {
      showToast("Could not copy Order ID.", "error");
    }
  }

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
    loadTransactions(data.order);

    const savedCards = JSON.parse(
      localStorage.getItem("viltrum_unlocked_cards") || "[]"
    );

    const alreadySaved = savedCards.some(
      (item: any) => item.id === data.order.id
    );

    const updatedCards = alreadySaved
      ? savedCards
      : [...savedCards, data.order];

    localStorage.setItem("viltrum_unlocked_cards", JSON.stringify(updatedCards));
    localStorage.setItem("viltrum_selected_card", JSON.stringify(data.order));

    setUnlockedCards(updatedCards);
    setLoading(false);
  }

  async function depositAction() {
    if (!order || !address) {
      showToast("Connect wallet first.", "error");
      return;
    }

    const amount = prompt("Enter deposit amount (USD)");

if (!amount) return;

const usd = Number(amount);

if (isNaN(usd) || usd <= 0) {
  showToast("Invalid amount.", "error");
  return;
}

const response = await fetch("/api/convert-usd", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ usd })
});

const result = await response.json();

if (!result.success) {
  showToast("Unable to calculate ETH amount.", "error");
  return;
}

const depositAmount = BigInt(result.wei);

    const minDeposit =
  depositLimits && Array.isArray(depositLimits)
    ? (depositLimits[0] as bigint)
    : BigInt(0);

    if (
      order.card_type === "free" &&
      order.status !== "active" &&
      depositAmount < minDeposit
    ) {
      showToast(
        `Minimum deposit required is $${Number(formatEther(minDeposit)).toFixed(2)}.`,
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

      if (order.card_type === "free" && order.status !== "active") {
        const latestBalance =
          vaultBalance ? (vaultBalance as bigint) + depositAmount : depositAmount;

        if (latestBalance < minDeposit) {
          alert(
            `Deposit successful, but activation request was not sent yet.\n\nMinimum required balance is $${Number(formatEther(minDeposit)).toFixed(2)}.\nYour current deposited balance is $${Number(formatEther(latestBalance)).toFixed(2)}.`
          );

          refetchBalance();
          setActiveModal("");
          return;
        }

        await fetch("/api/manage-card/free-activation-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            orderId: order.id
          })
        });

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
      showToast(err?.shortMessage || err?.message || "Deposit failed", "error");
    }
  }

  async function withdrawAction() {
    if (!order || !address) {
      showToast("Connect wallet first.", "error");
      return;
    }

    const amount = prompt("Enter withdrawal amount (USD)");

if (!amount) return;

const usd = Number(amount);

if (isNaN(usd) || usd <= 0) {
  showToast("Invalid amount.", "error");
  return;
}

const response = await fetch("/api/convert-usd", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ usd })
});

const result = await response.json();

if (!result.success) {
  showToast("Unable to calculate ETH amount.", "error");
  return;
}

const withdrawAmount = BigInt(result.wei);

    try {
      await writeContractAsync({
        address: VAULT_BANK_ADDRESS as `0x${string}`,
        abi: VAULT_BANK_ABI as any,
        functionName: "withdraw",
        args: [getCardTypeId(order.card_type), withdrawAmount]
      } as any);

      showToast("Withdrawal successful.", "success");
      refetchBalance();
      setActiveModal("");
    } catch (err: any) {
      showToast(err?.shortMessage || err?.message || "Withdrawal failed", "error");
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
                      loadTransactions(card);
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
              number={showDetails && order.card_number ? order.card_number : maskedNumber}
              holder={order.full_name || "Card Holder"}
              expiry={showDetails && order.card_exp ? order.card_exp : "**/**"}
              status={order.status ? order.status.toUpperCase() : "ACTIVE"}
            />
          ) : isFree ? (
            <FreePremiumCard
              number={showDetails && order.card_number ? order.card_number : maskedNumber}
              holder={order.full_name || "Card Holder"}
              expiry={showDetails && order.card_exp ? order.card_exp : "**/**"}
              blurred={isInactiveFree}
            />
          ) : isPhysical ? (
            <PhysicalPremiumCard
              number={showDetails && order.card_number ? order.card_number : maskedNumber}
              holder={order.full_name || "Card Holder"}
              expiry={showDetails && order.card_exp ? order.card_exp : "**/**"}
            />
          ) : null}

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
              <h2>{order.status === "active" ? "Free Card Active" : "Card Inactive"}</h2>
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
            <h2>{vaultBalanceUsd}</h2>
          )}

          <span>Available Balance</span>

          {isPhysical && (
            <div className="manage-bonus-balance">
              <div>
                <Gift size={20} />
                <small>Bonus Balance</small>
              </div>
              <b>$15.00</b>
            </div>
          )}
        </div>
      </section>

      <section className="manage-actions">
        {!(isFree && order.status !== "active") && (
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Card Details"}
          </button>
        )}

        <button onClick={() => setActiveModal("deposit")}>Deposit</button>

        {!(isFree && order.status !== "active") && (
          <button onClick={() => setActiveModal("withdraw")}>Withdraw</button>
        )}

        {!(isFree && order.status !== "active") && (
          <button onClick={() => setActiveModal("balance")}>Check Balance</button>
        )}

        {!(isFree && order.status !== "active") && (
          <button onClick={() => setActiveModal("transactions")}>
            Transaction History
          </button>
        )}

        {isPhysical && (
          <button onClick={() => setActiveModal("shipment")}>Track Shipment</button>
        )}

        <button onClick={() => setActiveModal("support")}>Help & Support</button>
      </section>

      {activeModal && (
        <div className="manage-modal-backdrop">
          <div className="manage-modal">
            <button
              className="manage-modal-close"
              onClick={() => setActiveModal("")}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {activeModal === "deposit" && (
              <>
                <div className="manage-modal-heading">
                  <ArrowDownToLine />
                  <div>
                    <h2>Deposit</h2>
                    <p>Add funds to your Viltrum vault balance.</p>
                  </div>
                </div>

                {isFree && order.status !== "active" && (
                  <div className="manage-modal-note">
                    Deposit request received. Please wait up to 2 hours while your
                    activation request is verified and processed.
                  </div>
                )}

                <button className="manage-modal-primary" onClick={depositAction}>
                  Deposit Now
                </button>
              </>
            )}

            {activeModal === "withdraw" && (
              <>
                <div className="manage-modal-heading">
                  <ArrowUpFromLine />
                  <div>
                    <h2>Withdraw</h2>
                    <p>Withdraw funds from your Viltrum vault.</p>
                  </div>
                </div>

                <button className="manage-modal-primary" onClick={withdrawAction}>
                  Withdraw Now
                </button>
              </>
            )}

            {activeModal === "balance" && (
              <>
                <div className="manage-modal-heading">
                  <Wallet />
                  <div>
                    <h2>Card Balance</h2>
                    <p>Your available vault balance.</p>
                  </div>
                </div>

                <p className="manage-modal-balance">
                   {vaultBalanceUsd}
               </p>

                <span className="manage-modal-subtext">Available Balance</span>
              </>
            )}

            {activeModal === "transactions" && (
              <>
                <div className="manage-modal-heading">
                  <FileText />
                  <div>
                    <h2>Transaction History</h2>
                    <p>Your completed transactions will appear here.</p>
                  </div>
                </div>

                {transactions.length === 0 ? (
                  <div className="manage-tx-empty">
                    <FileText size={38} />
                    <h3>No Transactions Yet</h3>
                    <p>Your completed transactions will appear here.</p>
                  </div>
                ) : (
                  <div className="manage-tx-list">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="manage-tx-item">
                        <div>
                          <b>{tx.type || tx.transaction_type}</b>
                          <p>{tx.status}</p>
                        </div>

                        <div>{formatUSD(tx.amount)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeModal === "shipment" && (
              <>
                <div className="manage-modal-heading">
                  <PackageSearch />
                  <div>
                    <h2>Track Shipment</h2>
                    <p>Physical card delivery status.</p>
                  </div>
                </div>

                <div className="manage-modal-note">
                  <b>Status:</b> {order.shipment_status || "Not started"}
                </div>

                <p className="manage-modal-subtext">
                  {order.tracking_note ||
                    "Tracking details will appear here once available."}
                </p>
              </>
            )}

            {activeModal === "support" && (
              <>
                <div className="manage-modal-heading">
                  <HelpCircle />
                  <div>
                    <h2>Support Center</h2>
                    <p>Need assistance? Contact our support team.</p>
                  </div>
                </div>

                <div className="manage-support-badge" onClick={copyOrderId}>
                  <div>
                    <small>Order ID</small>
                    <b>#{order.order_id}</b>
                  </div>
                  <Copy size={18} />
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
