import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client: any = createPublicClient({
  chain: sepolia,
  transport: http()
});

const VAULT_BANK_ADDRESS =
  "0x2c1a0dF1F767DA46Ea662B697408Db2Ed827fC9E";

const ABI: any = [
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
    const body = await req.json();
    const usd = Number(body.usd);

    if (isNaN(usd) || usd <= 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid USD amount"
      });
    }

    const usdCents = BigInt(Math.round(usd * 100));

    const wei = await client.readContract({
      address: VAULT_BANK_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: "usdCentsToWei",
      args: [usdCents]
    } as any);

    return NextResponse.json({
      success: true,
      wei: wei.toString()
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "Conversion failed"
    });
  }
}
