import crypto from "node:crypto";
import { resolve } from "node:path";

// Local development only: load `.env` if present (repo root or cwd).
// In production (Netlify functions) secrets come from the platform.
function tryLoadEnvFile() {
  const candidates = ["./.env", "../.env", "../../.env", "../../../.env"].map((p) => resolve(process.cwd(), p));
  for (const file of candidates) {
    try {
      process.loadEnvFile(file);
      break;
    } catch {
      // file not present — keep looking
    }
  }
}
tryLoadEnvFile();

const rawJwtSecret = process.env.JWT_SECRET;
if (!rawJwtSecret) {
  throw new Error("JWT_SECRET environment variable is required but was not provided.");
}
const JWT_SECRET: string = rawJwtSecret;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hash a password using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored PBKDF2 hash.
 * Plain-text stored passwords are rejected: they are never valid.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !password) return false;
  if (!stored.includes(":")) return false;
  const [salt, originalHash] = stored.split(":");
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

/**
 * Sign a JSON payload into a secure HMAC-SHA256 token with expiry
 */
export function signToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + TOKEN_TTL_MS) / 1000),
    }),
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

/**
 * Verify an HMAC-SHA256 token and extract payload.
 * Expired or malformed tokens return null.
 */
export function verifyToken(token: string): any {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
