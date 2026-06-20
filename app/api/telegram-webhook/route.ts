import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const update = await req.json();

  console.log("Telegram Update:", update);

  return NextResponse.json({
    ok: true
  });
}
