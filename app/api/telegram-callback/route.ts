import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifyTelegram(data: Record<string, string>) {
  const hash = data.hash;
  const checkString = Object.keys(data)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto
    .createHash("sha256")
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return hmac === hash;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const data: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    data[key] = value;
  });

  if (!verifyTelegram(data)) {
    return NextResponse.redirect(new URL("/login?telegram=failed", req.url));
  }

  const redirect = new URL("/connect-wallet", req.url);
  redirect.searchParams.set("telegram_id", data.id || "");
  redirect.searchParams.set("telegram_username", data.username || "");
  redirect.searchParams.set("telegram_name", data.first_name || "");

  return NextResponse.redirect(redirect);
}
