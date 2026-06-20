import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const username = String(body.telegram_username || "")
    .replace("@", "")
    .trim()
    .toLowerCase();

  const password = String(body.password || "");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("telegram_username", username)
    .single();

  if (!profile || !profile.password_hash || !profile.password_salt) {
    return NextResponse.json({ success: false, error: "Account not found" }, { status: 401 });
  }

  const checkHash = hashPassword(password, profile.password_salt);

  if (checkHash !== profile.password_hash) {
    return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    telegram_id: profile.telegram_id,
    telegram_username: profile.telegram_username,
    telegram_name: profile.telegram_name || ""
  });
}
