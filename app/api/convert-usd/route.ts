import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http()
});

const VAULT_BANK_ADDRESS =
  "0x2c1a0dF1F767DA46Ea662B697408Db2Ed827fC9E";

const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "usdCents",
        type: "uint256"
      }
    ],
    name: "usdCentsToWei",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export async function POST(req: Request) {
  try {
    const { usd } = await req.json();

    const wei = await client.readContract({
      address: VAULT_BANK_ADDRESS,
      abi: ABI,
      functionName: "usdCentsToWei",
      args: [BigInt(Math.round(Number(usd) * 100))]
    });

    return NextResponse.json({
      success: true,
      wei: wei.toString()
    });
  } catch (e) {
    return NextResponse.json({
      success: false
    });
  }
}
