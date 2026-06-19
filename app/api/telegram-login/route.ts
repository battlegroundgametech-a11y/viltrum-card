import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyTelegram(data: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const hash = data.hash;

  const checkString = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!verifyTelegram(data)) {
      return NextResponse.json(
        { error: "Telegram verification failed" },
        { status: 401 }
      );
    }

    const telegram_id = String(data.id);

    const { error } = await supabase.from("profiles").upsert(
      {
        telegram_id,
        telegram_username: data.username || "",
        telegram_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        telegram_verified: true
      },
      { onConflict: "telegram_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      telegram_id,
      telegram_username: data.username || "",
      telegram_name: data.first_name || ""
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
