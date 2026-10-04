import { Env, MetaWebhookPayload } from './types';
import { verifyWebhookChallenge, verifyMetaSignature } from './security';
import { WorkerSupabaseClient } from './supabaseClient';
import { MetaCloudApiClient } from './metaClient';
import { WhatsAppStateMachine } from './stateMachine';
import { runGoogleSheetSync } from './googleSync';

export default {
  /**
   * Main Worker Fetch Event Handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Health Check Endpoint
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Meta Verification Challenge (GET /webhook/whatsapp)
    if (url.pathname === '/webhook/whatsapp' && request.method === 'GET') {
      return verifyWebhookChallenge(request, env);
    }

    // 3. Meta Webhook Incoming Event Handler (POST /webhook/whatsapp)
    if (url.pathname === '/webhook/whatsapp' && request.method === 'POST') {
      const rawBody = await request.text();
      const signatureHeader = request.headers.get('x-hub-signature-256');

      // Verify HMAC SHA-256 Meta Webhook Signature
      const isValidSignature = await verifyMetaSignature(rawBody, signatureHeader, env.META_APP_SECRET);
      if (!isValidSignature) {
        return new Response('Unauthorized: Invalid HMAC Webhook Signature', { status: 401 });
      }

      let payload: MetaWebhookPayload;
      try {
        payload = JSON.parse(rawBody);
      } catch (e) {
        return new Response('Bad Request: Invalid JSON', { status: 400 });
      }

      // Process Payload asynchronously in background to return quick 200 OK to Meta
      ctx.waitUntil(handleMetaEvent(payload, env));

      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    // 4. Manual Google Sheet Export Trigger (POST /admin/sync-sheet)
    if (url.pathname === '/admin/sync-sheet' && request.method === 'POST') {
      const authHeader = request.headers.get('x-admin-sync-key');
      if (authHeader !== env.META_VERIFY_TOKEN) {
        return new Response(JSON.stringify({ error: 'Unauthorized manual sync key' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const syncResult = await runGoogleSheetSync(env);
      return new Response(JSON.stringify(syncResult), {
        status: syncResult.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },

  /**
   * Scheduled Cron Event Handler (Automated 12-Hour Export)
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runGoogleSheetSync(env));
  },
};

/**
 * Handle Incoming Meta WhatsApp Event Payload
 */
async function handleMetaEvent(payload: MetaWebhookPayload, env: Env): Promise<void> {
  if (payload.object !== 'whatsapp_business_account' || !payload.entry) {
    return;
  }

  const supabase = new WorkerSupabaseClient(env);
  const metaClient = new MetaCloudApiClient(env);
  const stateMachine = new WhatsAppStateMachine(supabase, metaClient);

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      const value = change.value;
      if (!value.messages || value.messages.length === 0) continue;

      for (const msg of value.messages) {
        const messageId = msg.id;
        const fromPhone = msg.from;

        // Enforce Idempotency (Skip if duplicate message ID)
        const isNewMessage = await supabase.checkAndRecordMessage(messageId, fromPhone);
        if (!isNewMessage) {
          continue; // Duplicate event safely ignored
        }

        // Extract User Input (Text, Button Reply, or List Reply)
        let messageText = '';
        let buttonOrListId: string | null = null;

        if (msg.type === 'text' && msg.text) {
          messageText = msg.text.body;
        } else if (msg.type === 'interactive' && msg.interactive) {
          if (msg.interactive.button_reply) {
            buttonOrListId = msg.interactive.button_reply.id;
            messageText = msg.interactive.button_reply.title;
          } else if (msg.interactive.list_reply) {
            buttonOrListId = msg.interactive.list_reply.id;
            messageText = msg.interactive.list_reply.title;
          }
        }

        if (messageText || buttonOrListId) {
          await stateMachine.processIncomingMessage(fromPhone, messageText, buttonOrListId);
        }
      }
    }
  }
}
