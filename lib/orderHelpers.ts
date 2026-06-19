export function generateOrderId() {
  return "VIL-" + Math.floor(100000 + Math.random() * 900000);
}

export function generateSecretCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "VLT-";
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function generateDemoCard() {
  return {
    card_number: "4242 4242 4242 " + Math.floor(1000 + Math.random() * 9000),
    cvv: String(Math.floor(100 + Math.random() * 900)),
    expiry: "12/30"
  };
}
