import { Env } from './types';

export class MetaCloudApiClient {
  private token: string;
  private phoneNumberId: string;
  private baseUrl: string;

  constructor(env: Env) {
    this.token = env.META_ACCESS_TOKEN;
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseUrl = `https://graph.facebook.com/v19.0/${this.phoneNumberId}/messages`;
  }

  /**
   * Send Text Message
   */
  async sendTextMessage(to: string, text: string): Promise<boolean> {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    };

    return this.postMessage(body);
  }

  /**
   * Send Interactive Buttons (Max 3 buttons supported by Meta)
   */
  async sendInteractiveButtons(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<boolean> {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map((b) => ({
            type: 'reply',
            reply: { id: b.id, title: b.title.substring(0, 20) },
          })),
        },
      },
    };

    return this.postMessage(body);
  }

  /**
   * Send Interactive List Message
   */
  async sendInteractiveList(
    to: string,
    headerText: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>
  ): Promise<boolean> {
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: headerText },
        body: { text: bodyText },
        action: {
          button: buttonText.substring(0, 20),
          sections: sections.map((sec) => ({
            title: sec.title.substring(0, 24),
            rows: sec.rows.map((row) => ({
              id: row.id,
              title: row.title.substring(0, 24),
              description: row.description ? row.description.substring(0, 72) : undefined,
            })),
          })),
        },
      },
    };

    return this.postMessage(body);
  }

  private async postMessage(payload: any): Promise<boolean> {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return res.ok;
    } catch (err) {
      return false;
    }
  }
}
