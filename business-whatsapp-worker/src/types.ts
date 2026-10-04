export interface Env {
  ENVIRONMENT: string;
  META_VERIFY_TOKEN: string;
  META_APP_SECRET: string;
  META_ACCESS_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
  GOOGLE_SPREADSHEET_ID?: string;
}

export type WhatsAppState =
  | 'MAIN_MENU'
  | 'SERVICES'
  | 'SERVICE_OPTION'
  | 'COLLECT_NAME'
  | 'COLLECT_PHONE'
  | 'COLLECT_EMAIL'
  | 'COLLECT_LOCATION'
  | 'APPOINTMENT_DATE'
  | 'APPOINTMENT_TIME'
  | 'CONFIRM_DATA'
  | 'COMPLETED';

export interface SessionPayload {
  selected_service?: string;
  selected_sub_service?: string;
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  preferred_date?: string;
  preferred_time?: string;
  flow_type?: 'enquiry' | 'appointment';
}

export interface WhatsAppSession {
  id?: string;
  phone: string;
  current_state: WhatsAppState;
  state_payload: SessionPayload;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MetaWebhookPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          interactive?: {
            type: string;
            button_reply?: { id: string; title: string };
            list_reply?: { id: string; title: string; description?: string };
          };
        }>;
      };
      field: string;
    }>;
  }>;
}
