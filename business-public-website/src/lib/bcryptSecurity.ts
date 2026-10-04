import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // High work-factor bcrypt hashing to prevent brute-force attacks

/**
 * Hash a plain text string (e.g. secret token, password, or security code) using bcrypt
 */
export async function hashSecret(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

/**
 * Compare a plain text string against a stored bcrypt hash
 */
export async function verifySecret(plainText: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    return false;
  }
}
