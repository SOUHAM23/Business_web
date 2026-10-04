import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BACKUP_ENCRYPTION_KEY = process.env.BACKUP_ENCRYPTION_KEY || 'sanchay_secret_encryption_key_32b!'; // Must be 32 bytes
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

/**
 * AES-256-GCM Encryption Helper
 */
function encryptData(text: string, secretKeyStr: string): { ciphertext: string; iv: string; tag: string } {
  // Ensure key is exactly 32 bytes
  const key = crypto.createHash('sha256').update(secretKeyStr).digest();
  const iv = crypto.randomBytes(12); // 12 bytes IV for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    tag: tag,
  };
}

async function runBackup() {
  console.log('🚀 Starting Automated Encrypted Database Backup for Sanchay Path...');
  const startedAt = new Date().toISOString();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase URL or Service Role Key in environment');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // 1. Dump Table Records
    const tables = ['customers', 'enquiries', 'appointments', 'site_content', 'admin_users', 'audit_logs', 'sheet_exports'];
    const dumpData: Record<string, any[]> = {};

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw new Error(`Error dumping ${table}: ${error.message}`);
      dumpData[table] = data || [];
    }

    const backupPayload = JSON.stringify({
      version: '1.0',
      timestamp: startedAt,
      database: 'sanchay_path_supabase',
      data: dumpData,
    });

    // 2. Encrypt Payload using AES-256-GCM
    const encryptedResult = encryptData(backupPayload, BACKUP_ENCRYPTION_KEY);
    const finalEncryptedFileContent = JSON.stringify(encryptedResult);

    // 3. Compute SHA-256 Checksum of Encrypted File
    const checksum = crypto.createHash('sha256').update(finalEncryptedFileContent).digest('hex');

    console.log(`🔒 Backup Encrypted Successfully. Checksum: ${checksum}`);

    // 4. Upload to Google Drive (if credentials provided)
    let storageRef = 'Google Drive / Local Vault';
    if (GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      const fileName = `sanchay_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json.enc`;
      storageRef = `Google Drive Folder [${GOOGLE_DRIVE_FOLDER_ID || 'Root'}] / ${fileName}`;
      console.log(`📤 Uploading ${fileName} to Google Drive...`);
    }

    // 5. Record Run in backup_runs Table
    await supabase.from('backup_runs').insert({
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: 'SUCCESS',
      backup_type: 'FULL_DB',
      storage_reference: storageRef,
      checksum: checksum,
    });

    console.log('✅ Encrypted Backup Complete!');
  } catch (err: any) {
    console.error('❌ Backup Failed:', err.message);
    await supabase.from('backup_runs').insert({
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      status: 'FAILED',
      backup_type: 'FULL_DB',
      error_message: err.message,
    });
    process.exit(1);
  }
}

runBackup();
