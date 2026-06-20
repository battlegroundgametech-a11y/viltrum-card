import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    return NextResponse.redirect(new URL("/login?error=telegram", req.url));
  }

  await supabase.from("profiles").upsert(
    {
      telegram_id: String(data.id),
      telegram_username: data.username || "",
      telegram_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      telegram_verified: true
    },
    { onConflict: "telegram_id" }
  );

  const redirect = new URL("/telegram-success", req.url);
  redirect.searchParams.set("id", data.id || "");
  redirect.searchParams.set("username", data.username || "");
  redirect.searchParams.set("name", data.first_name || "");

  return NextResponse.redirect(redirect);
}
