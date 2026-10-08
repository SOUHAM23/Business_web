import { Env, WhatsAppSession, SessionPayload } from './types';

export class WorkerSupabaseClient {
  private url: string;
  private serviceKey: string;

  constructor(env: Env) {
    this.url = env.SUPABASE_URL.replace(/\/$/, '');
    this.serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  }

  private headers() {
    return {
      'apikey': this.serviceKey,
      'Authorization': `Bearer ${this.serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };
  }

  /**
   * Idempotency Check: Checks if external_message_id already exists.
   * If not, inserts it into incoming_messages.
   */
  async checkAndRecordMessage(externalMessageId: string, phone: string): Promise<boolean> {
    const checkRes = await fetch(
      `${this.url}/rest/v1/incoming_messages?external_message_id=eq.${encodeURIComponent(externalMessageId)}&select=id`,
      { headers: this.headers() }
    );

    if (checkRes.ok) {
      const data: any = await checkRes.json();
      if (Array.isArray(data) && data.length > 0) {
        // Message already processed! Idempotency triggered.
        return false;
      }
    }

    // Record message ID
    await fetch(`${this.url}/rest/v1/incoming_messages`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        external_message_id: externalMessageId,
        phone,
        message_type: 'text',
        processing_status: 'PROCESSED',
        processed_at: new Date().toISOString(),
      }),
    });

    return true;
  }

  /**
   * Get or Create WhatsApp Session
   */
  async getSession(phone: string): Promise<WhatsAppSession> {
    const res = await fetch(
      `${this.url}/rest/v1/whatsapp_sessions?phone=eq.${encodeURIComponent(phone)}&select=*`,
      { headers: this.headers() }
    );

    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0] as WhatsAppSession;
      }
    }

    // Create new session
    const newSession: WhatsAppSession = {
      phone,
      current_state: 'MAIN_MENU',
      state_payload: {},
    };

    const insertRes = await fetch(`${this.url}/rest/v1/whatsapp_sessions`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(newSession),
    });

    if (insertRes.ok) {
      const created: any = await insertRes.json();
      return created[0] as WhatsAppSession;
    }

    return newSession;
  }

  /**
   * Update WhatsApp Session
   */
  async updateSession(phone: string, currentState: string, payload: SessionPayload): Promise<void> {
    await fetch(`${this.url}/rest/v1/whatsapp_sessions?phone=eq.${encodeURIComponent(phone)}`, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify({
        current_state: currentState,
        state_payload: payload,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  }

  /**
   * Upsert Customer Record
   */
  async upsertCustomer(data: { phone: string; name?: string; email?: string; location?: string }): Promise<string | null> {
    const res = await fetch(`${this.url}/rest/v1/customers`, {
      method: 'POST',
      headers: {
        ...this.headers(),
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const rows: any = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0].id;
      }
    }
    return null;
  }

  /**
   * Create Enquiry Record
   */
  async createEnquiry(data: { customer_id: string | null; service: string; sub_service?: string; message?: string }): Promise<void> {
    await fetch(`${this.url}/rest/v1/enquiries`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        customer_id: data.customer_id,
        source: 'whatsapp',
        service: data.service,
        sub_service: data.sub_service || null,
        message: data.message || 'Submitted via WhatsApp Bot',
        status: 'NEW',
        synced_to_sheet: false,
      }),
    });
  }

  /**
   * Create Appointment Record
   */
  async createAppointment(data: { customer_id: string | null; service: string; preferred_date: string; preferred_time: string }): Promise<void> {
    await fetch(`${this.url}/rest/v1/appointments`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        customer_id: data.customer_id,
        service: data.service,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        status: 'PENDING',
        notes: 'Booked via WhatsApp Bot',
      }),
    });
  }
}
