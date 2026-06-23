export const FREE_MINT_ADDRESS =
  "0x889313974154503451840Abf014406eD48d85aBD";

export const FREE_MINT_ABI: any = [
  {
    inputs: [],
    name: "freeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "freeMintEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];
