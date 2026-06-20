import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashPassword(password: string, salt: string) {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name = String(body.name || "").trim();
  const username = String(body.telegram_username || "")
    .replace("@", "")
    .trim()
    .toLowerCase();

  const otp = String(body.otp || "").trim();
  const password = String(body.password || "");

  if (!name || !username || !otp || !password) {
    return NextResponse.json(
      { success: false, error: "All fields are required" },
      { status: 400 }
    );
  }

  const { data: otpRow } = await supabase
    .from("signup_otps")
    .select("*")
    .eq("telegram_username", username)
    .eq("otp", otp)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!otpRow) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const password_hash = hashPassword(password, salt);

  const { error } = await supabase.from("profiles").upsert(
    {
      telegram_id: otpRow.telegram_id,
      telegram_username: username,
      telegram_name: name,
      telegram_verified: true,
      password_hash,
      password_salt: salt
    },
    { onConflict: "telegram_id" }
  );

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  await supabase
    .from("signup_otps")
    .update({ used: true })
    .eq("id", otpRow.id);

  return NextResponse.json({
    success: true,
    telegram_id: otpRow.telegram_id,
    telegram_username: username,
    telegram_name: name
  });
}
