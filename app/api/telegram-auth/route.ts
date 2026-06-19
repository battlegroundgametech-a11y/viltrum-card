import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifyTelegramAuth(data: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const { hash, ...rest } = data;

  const secret = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const data: any = {};

  url.searchParams.forEach((value, key) => {
    data[key] = value;
  });

  if (!verifyTelegramAuth(data)) {
    return NextResponse.redirect(new URL("/login?error=telegram_failed", req.url));
  }

  const telegramId = data.id;
  const telegramUsername = data.username || "";
  const telegramName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

  const { data: profile } = await supabase
    .from("profiles")
    .upsert(
      {
        telegram_id: telegramId,
        telegram_username: telegramUsername,
        telegram_name: telegramName
      },
      { onConflict: "telegram_id" }
    )
    .select()
    .single();

  const redirectUrl = new URL("/connect-wallet", req.url);
  redirectUrl.searchParams.set("profile", profile.id);
  redirectUrl.searchParams.set("telegram", telegramUsername || telegramName);

  return NextResponse.redirect(redirectUrl);
}
