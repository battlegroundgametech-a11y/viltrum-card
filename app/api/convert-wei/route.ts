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
        name: "weiAmount",
        type: "uint256"
      }
    ],
    name: "weiToUsdCents",
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
    const wei = BigInt(String(body.wei || "0"));

    const usdCents = await client.readContract({
      address: VAULT_BANK_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: "weiToUsdCents",
      args: [wei]
    } as any);

    return NextResponse.json({
      success: true,
      usdCents: usdCents.toString()
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "Conversion failed"
    });
  }
}
