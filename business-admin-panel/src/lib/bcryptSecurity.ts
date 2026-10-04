import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a secret token or password using bcrypt with 12 salt rounds
 */
export async function hashSecret(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainText, salt);
}

/**
 * Safely compare plain text against a stored bcrypt hash
 */
export async function verifySecret(plainText: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    return false;
  }
}
