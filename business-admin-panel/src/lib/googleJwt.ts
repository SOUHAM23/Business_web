import crypto from 'crypto';

/**
 * Generate Google OAuth Access Token for Service Account in Node environment
 */
export async function createGoogleJwt(email: string, privateKeyPem: string, scope: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: email,
    scope: scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Claim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const unsignedToken = `${base64Header}.${base64Claim}`;

  const formattedKey = privateKeyPem.replace(/\\n/g, '\n');
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  const signature = signer.sign(formattedKey, 'base64url');

  const jwt = `${unsignedToken}.${signature}`;

  // Exchange JWT for OAuth Access Token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const data: any = await res.json();
  if (!res.ok) {
    throw new Error(`Google OAuth Token Error: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}
