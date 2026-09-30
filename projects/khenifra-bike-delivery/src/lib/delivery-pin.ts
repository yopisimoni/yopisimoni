import crypto from "node:crypto";

function getSecret() {
  const secret = process.env.DELIVERY_PIN_SECRET || process.env.APPWRITE_SERVER_API_KEY;
  if (!secret) throw new Error("DELIVERY_PIN_SECRET is not configured");
  return secret;
}

export function deliveryPin(deliveryId: string) {
  const digest = crypto
    .createHmac("sha256", getSecret())
    .update(deliveryId)
    .digest();

  const value = digest.readUInt32BE(0) % 10000;
  return value.toString().padStart(4, "0");
}
