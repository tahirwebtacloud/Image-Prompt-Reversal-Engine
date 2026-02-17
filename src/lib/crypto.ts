/**
 * Simple AES encryption for API keys at rest.
 * Uses Web Crypto API (available in Node.js 18+ and Edge Runtime).
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

function getEncryptionKey(): string {
  const key = process.env.NEXTAUTH_SECRET;
  if (!key) throw new Error("NEXTAUTH_SECRET is required for encryption");
  return key;
}

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("post-analyzer-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptApiKey(plainText: string): Promise<string> {
  const secret = getEncryptionKey();
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plainText)
  );

  // Combine IV + encrypted data and encode as base64
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return Buffer.from(combined).toString("base64");
}

export async function decryptApiKey(encryptedBase64: string): Promise<string> {
  const secret = getEncryptionKey();
  const key = await deriveKey(secret);

  const combined = new Uint8Array(Buffer.from(encryptedBase64, "base64"));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

export async function hashApiKey(plainKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
