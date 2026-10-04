import { Env } from './types';
import { WorkerSupabaseClient } from './supabaseClient';

export async function runGoogleSheetSync(env: Env): Promise<{ success: boolean; rows: number; error?: string }> {
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || !env.GOOGLE_SPREADSHEET_ID) {
    return { success: false, rows: 0, error: 'Google Sheet API credentials not configured in Worker secrets.' };
  }

  const supabase = new WorkerSupabaseClient(env);

  try {
    // 1. Fetch Enquiries from Supabase
    const res = await fetch(
      `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/enquiries?select=id,created_at,service,status,source,message,customers(name,phone,email,location)&order=created_at.desc&limit=500`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch enquiries from Supabase: ${res.statusText}`);
    }

    const enquiries: any[] = await res.json();

    // 2. Format Sanitized Rows for Business Sheet
    // Headers: Date, Customer Name, Mobile, Email, Location, Service, Source, Status, Message
    const rows = [
      ['Date', 'Customer Name', 'Mobile', 'Email', 'Location', 'Service', 'Source', 'Status', 'Message'],
      ...enquiries.map((e) => [
        e.created_at ? new Date(e.created_at).toLocaleString('en-IN') : '',
        e.customers?.name || 'N/A',
        e.customers?.phone || 'N/A',
        e.customers?.email || 'N/A',
        e.customers?.location || 'N/A',
        e.service || 'N/A',
        e.source || 'N/A',
        e.status || 'NEW',
        e.message || '',
      ]),
    ];

    // 3. Generate Service Account JWT Token for Google API
    const jwt = await createGoogleJwt(
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      'https://www.googleapis.com/auth/spreadsheets'
    );

    // 4. Clear & Update Sheet via Google Sheets REST API
    const sheetId = env.GOOGLE_SPREADSHEET_ID;
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:I${rows.length}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `Sheet1!A1:I${rows.length}`,
          majorDimension: 'ROWS',
          values: rows,
        }),
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Google Sheets API error: ${errText}`);
    }

    // 5. Record Export Success in sheet_exports table
    await recordSheetExportStatus(env, 'SUCCESS', enquiries.length, null);

    return { success: true, rows: enquiries.length };
  } catch (err: any) {
    const errorMsg = err.message || String(err);
    await recordSheetExportStatus(env, 'FAILED', 0, errorMsg);
    return { success: false, rows: 0, error: errorMsg };
  }
}

async function recordSheetExportStatus(env: Env, status: string, rowCount: number, errorMsg: string | null) {
  try {
    await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/sheet_exports`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed_at: new Date().toISOString(),
        status,
        type: '12H_SNAPSHOT',
        row_count: rowCount,
        error_message: errorMsg,
      }),
    });
  } catch (e) {}
}

/**
 * Generate Google JWT Token for Service Account in Web Standard Crypto
 */
async function createGoogleJwt(email: string, privateKeyPem: string, scope: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: email,
    scope: scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  // Parse RSA Private Key PEM
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  let pemContents = privateKeyPem.replace(/\\n/g, '\n').trim();
  if (pemContents.startsWith(pemHeader)) {
    pemContents = pemContents.substring(pemHeader.length);
  }
  if (pemContents.endsWith(pemFooter)) {
    pemContents = pemContents.substring(0, pemContents.length - pemFooter.length);
  }
  pemContents = pemContents.replace(/\s+/g, '');

  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = base64UrlEncodeUint8Array(new Uint8Array(signature));
  const jwt = `${unsignedToken}.${encodedSignature}`;

  // Exchange JWT for OAuth access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const tokenData: any = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(`Google OAuth Token Error: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}

function base64UrlEncode(str: string): string {
  return base64UrlEncodeUint8Array(new TextEncoder().encode(str));
}

function base64UrlEncodeUint8Array(buf: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buf.length; i++) {
    binary += String.fromCharCode(buf[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
