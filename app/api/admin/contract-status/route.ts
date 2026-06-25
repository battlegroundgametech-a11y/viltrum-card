import { NextResponse } from "next/server";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

import {
  CARD_SALE_ADDRESS,
  CARD_SALE_ABI
} from "../../../../lib/cardSale";

import {
  FREE_MINT_ADDRESS,
  FREE_MINT_ABI
} from "../../../../lib/freeMintContract";

import {
  VAULT_BANK_ADDRESS,
  VAULT_BANK_ABI,
  getCardTypeId
} from "../../../../lib/vaultBank";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

async function getBankLimits(cardType: string) {
  const cardTypeId = getCardTypeId(cardType);

  const limits = await publicClient.readContract({
    address: VAULT_BANK_ADDRESS as `0x${string}`,
    abi: VAULT_BANK_ABI as any,
    functionName: "cardLimits",
    args: [cardTypeId]
  } as any);

  const arr = limits as any[];

  return {
    minDeposit: formatEther(arr[0] as bigint),
    maxDeposit: formatEther(arr[1] as bigint),
    minWithdraw: formatEther(arr[2] as bigint),
    maxWithdraw: formatEther(arr[3] as bigint),
    depositEnabled: Boolean(arr[4]),
    withdrawEnabled: Boolean(arr[5])
  };
}

export async function GET() {
  try {
    const [
      virtualEnabled,
      physicalEnabled,
      virtualMax,
      physicalMax,
      freeEnabled,
      freeMax,
      freeLimits,
      virtualLimits,
      physicalLimits
    ] = await Promise.all([
      publicClient.readContract({
        address: CARD_SALE_ADDRESS as `0x${string}`,
        abi: CARD_SALE_ABI as any,
        functionName: "virtualPurchaseEnabled"
      } as any),

      publicClient.readContract({
        address: CARD_SALE_ADDRESS as `0x${string}`,
        abi: CARD_SALE_ABI as any,
        functionName: "physicalPurchaseEnabled"
      } as any),

      publicClient.readContract({
        address: CARD_SALE_ADDRESS as `0x${string}`,
        abi: CARD_SALE_ABI as any,
        functionName: "virtualMaxPerWallet"
      } as any),

      publicClient.readContract({
        address: CARD_SALE_ADDRESS as `0x${string}`,
        abi: CARD_SALE_ABI as any,
        functionName: "physicalMaxPerWallet"
      } as any),

      publicClient.readContract({
        address: FREE_MINT_ADDRESS as `0x${string}`,
        abi: FREE_MINT_ABI as any,
        functionName: "freeMintEnabled"
      } as any),

      publicClient.readContract({
        address: FREE_MINT_ADDRESS as `0x${string}`,
        abi: FREE_MINT_ABI as any,
        functionName: "maxMintPerWallet"
      } as any),

      getBankLimits("free"),
      getBankLimits("virtual"),
      getBankLimits("physical")
    ]);

    return NextResponse.json({
      success: true,
      status: {
        virtualPurchaseEnabled: Boolean(virtualEnabled),
        physicalPurchaseEnabled: Boolean(physicalEnabled),
        freeMintEnabled: Boolean(freeEnabled),

        virtualMaxPerWallet: String(virtualMax),
        physicalMaxPerWallet: String(physicalMax),
        freeMaxPerWallet: String(freeMax),

        free: freeLimits,
        virtual: virtualLimits,
        physical: physicalLimits
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}
