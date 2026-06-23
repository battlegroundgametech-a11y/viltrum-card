export const VAULT_BANK_ADDRESS =
  "0xBe8582a58312146a1CD2AE430FF0D3200D3AFC1c";

export const VAULT_BANK_ABI: any = [
  {
    inputs: [{ internalType: "enum ViltrumVaultBank.CardType", name: "cardType", type: "uint8" }],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "enum ViltrumVaultBank.CardType", name: "cardType", type: "uint8" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "enum ViltrumVaultBank.CardType", name: "cardType", type: "uint8" }
    ],
    name: "getBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "enum ViltrumVaultBank.CardType", name: "", type: "uint8" }],
    name: "cardLimits",
    outputs: [
      { internalType: "uint256", name: "minDeposit", type: "uint256" },
      { internalType: "uint256", name: "maxDeposit", type: "uint256" },
      { internalType: "uint256", name: "minWithdraw", type: "uint256" },
      { internalType: "uint256", name: "maxWithdraw", type: "uint256" },
      { internalType: "bool", name: "depositEnabled", type: "bool" },
      { internalType: "bool", name: "withdrawEnabled", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export function getCardTypeId(cardType: string) {
  if (cardType === "free") return 0;
  if (cardType === "virtual") return 1;
  if (cardType === "physical") return 2;
  return 1;
}
