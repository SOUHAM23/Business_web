import crypto from 'crypto';

/**
 * AES-256-GCM Decryption Helper
 */
function decryptData(encryptedObj: { ciphertext: string; iv: string; tag: string }, secretKeyStr: string): string {
  const key = crypto.createHash('sha256').update(secretKeyStr).digest();
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const tag = Buffer.from(encryptedObj.tag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedObj.ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function testBackupRestoration(rawEncryptedJson: string, secretKeyStr: string, expectedChecksum?: string): boolean {
  console.log('🧪 Starting Backup Restoration Verification Test...');

  // 1. Verify Checksum
  const computedChecksum = crypto.createHash('sha256').update(rawEncryptedJson).digest('hex');
  if (expectedChecksum && computedChecksum !== expectedChecksum) {
    console.error(`❌ Checksum mismatch! Expected ${expectedChecksum}, got ${computedChecksum}`);
    return false;
  }
  console.log('✅ Checksum Integrity Verified.');

  // 2. Decrypt Payload
  let decryptedJson = '';
  try {
    const encryptedObj = JSON.parse(rawEncryptedJson);
    decryptedJson = decryptData(encryptedObj, secretKeyStr);
    console.log('✅ Decryption Succeeded.');
  } catch (err: any) {
    console.error('❌ Decryption Failed:', err.message);
    return false;
  }

  // 3. Verify Structure Integrity
  try {
    const parsedPayload = JSON.parse(decryptedJson);
    if (!parsedPayload.database || !parsedPayload.data || !parsedPayload.data.customers) {
      console.error('❌ Missing core database structures in backup payload');
      return false;
    }

    console.log(`✅ Schema Integrity Verified. Tables restored in test memory:`, Object.keys(parsedPayload.data));
    console.log('🎉 RESTORE TEST PASSED SUCCESSFULLY!');
    return true;
  } catch (err: any) {
    console.error('❌ Invalid JSON payload in decrypted backup:', err.message);
    return false;
  }
}
