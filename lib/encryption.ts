import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The result is a hex-encoded string containing IV + Tag + Ciphertext.
 */
export function encrypt(text: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  // Return IV + Tag + Encrypted content as a single hex string
  return iv.toString("hex") + tag.toString("hex") + encrypted;
}

/**
 * Decrypts a hex-encoded string (IV + Tag + Ciphertext) using AES-256-GCM.
 */
export function decrypt(encryptedText: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  }

  const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), "hex");
  const tag = Buffer.from(
    encryptedText.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2),
    "hex"
  );
  const text = encryptedText.slice((IV_LENGTH + TAG_LENGTH) * 2);

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, "hex"), iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
