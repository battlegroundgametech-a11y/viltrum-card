import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";
import {
  VAULT_BANK_ADDRESS,
  VAULT_BANK_ABI,
  getCardTypeId
} from "../../../../lib/vaultBank";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body.orderId;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({
        success: false,
        error: "Order not found"
      });
    }

    const cardTypeId = getCardTypeId(order.card_type);

    const balance = await publicClient.readContract({
      address: VAULT_BANK_ADDRESS as `0x${string}`,
      abi: VAULT_BANK_ABI as any,
      functionName: "getBalance",
      args: [
        order.wallet_address as `0x${string}`,
        cardTypeId
      ]
    });

    const limits = await publicClient.readContract({
      address: VAULT_BANK_ADDRESS as `0x${string}`,
      abi: VAULT_BANK_ABI as any,
      functionName: "cardLimits",
      args: [cardTypeId]
    });

    const minDeposit = Array.isArray(limits)
      ? (limits[0] as bigint)
      : BigInt(0);

    const minDone =
      (balance as bigint) >= minDeposit;

    const { error } = await supabase
      .from("orders")
      .update({
        status: "pending_free_approval",
        free_min_deposit_done: minDone,
        free_current_deposit: formatEther(balance as bigint),
        free_required_deposit: formatEther(minDeposit)
      })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }

    return NextResponse.json({
      success: true,
      minDone,
      currentDeposit: formatEther(balance as bigint),
      requiredDeposit: formatEther(minDeposit)
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    });
  }
}
