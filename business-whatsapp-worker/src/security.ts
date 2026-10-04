import { Env } from './types';

/**
 * Verify Meta Webhook Subscription Challenge (GET /webhook/whatsapp)
 */
export function verifyWebhookChallenge(request: Request, env: Env): Response {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden: Invalid Verification Token', { status: 403 });
}

/**
 * Verify Meta Webhook Request Signature (POST /webhook/whatsapp)
 * Meta sends `x-hub-signature-256: sha256=<signature>` header
 */
export async function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const expectedHashHex = signatureHeader.substring(7);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(appSecret);
  const bodyData = encoder.encode(rawBody);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, bodyData);

    const computedHashHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return computedHashHex.toLowerCase() === expectedHashHex.toLowerCase();
  } catch (err) {
    return false;
  }
}
