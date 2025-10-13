import crypto from "node:crypto";

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, salt, expectedHash) {
  const computed = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  // Use constant-time comparison
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(expectedHash, "hex"));
}

// Minimal HMAC-signed token for coursework demos (NOT a JWT)
export function makeToken(payload) {
  const secret = process.env.APP_SECRET || "dev-secret";
  const base = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(base).digest("base64url");
  return `${base}.${sig}`;
}
