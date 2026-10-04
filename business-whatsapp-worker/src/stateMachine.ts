import { WorkerSupabaseClient } from './supabaseClient';
import { MetaCloudApiClient } from './metaClient';
import { WhatsAppSession, SessionPayload } from './types';

export class WhatsAppStateMachine {
  private supabase: WorkerSupabaseClient;
  private metaClient: MetaCloudApiClient;

  constructor(supabase: WorkerSupabaseClient, metaClient: MetaCloudApiClient) {
    this.supabase = supabase;
    this.metaClient = metaClient;
  }

  async processIncomingMessage(
    userPhone: string,
    messageText: string,
    buttonOrListId: string | null
  ): Promise<void> {
    const session: WhatsAppSession = await this.supabase.getSession(userPhone);
    const input = (buttonOrListId || messageText).trim();

    // Check Global Commands (Back, Main Menu, Cancel)
    if (input.toLowerCase() === 'main_menu' || input.toLowerCase() === 'menu' || input.toLowerCase() === 'restart') {
      await this.transitionTo(userPhone, 'MAIN_MENU', {});
      return;
    }

    switch (session.current_state) {
      case 'MAIN_MENU':
        await this.handleMainMenu(userPhone, input, session.state_payload);
        break;

      case 'SERVICES':
        await this.handleServicesMenu(userPhone, input, session.state_payload);
        break;

      case 'COLLECT_NAME':
        await this.handleCollectName(userPhone, input, session.state_payload);
        break;

      case 'COLLECT_EMAIL':
        await this.handleCollectEmail(userPhone, input, session.state_payload);
        break;

      case 'COLLECT_LOCATION':
        await this.handleCollectLocation(userPhone, input, session.state_payload);
        break;

      case 'APPOINTMENT_DATE':
        await this.handleAppointmentDate(userPhone, input, session.state_payload);
        break;

      case 'APPOINTMENT_TIME':
        await this.handleAppointmentTime(userPhone, input, session.state_payload);
        break;

      case 'CONFIRM_DATA':
        await this.handleConfirmData(userPhone, input, session.state_payload);
        break;

      case 'COMPLETED':
      default:
        await this.transitionTo(userPhone, 'MAIN_MENU', {});
        break;
    }
  }

  // --- STATE HANDLERS ---

  private async sendMainMenuOptions(to: string): Promise<void> {
    const text =
      `Welcome to *Sanchay Path Financial Services*! 📈\n` +
      `*Invest Today, Grow Tomorrow.*\n\n` +
      `Please choose an option from the menu below:`;

    await this.metaClient.sendInteractiveButtons(to, text, [
      { id: 'opt_services', title: '💼 Services' },
      { id: 'opt_appointment', title: '📅 Book Consultation' },
      { id: 'opt_contact', title: '📍 Location & Contact' },
    ]);
  }

  private async handleMainMenu(to: string, input: string, payload: SessionPayload): Promise<void> {
    if (input === 'opt_services' || input.includes('1') || input.toLowerCase().includes('service')) {
      await this.metaClient.sendInteractiveList(
        to,
        'Financial Services',
        'Select a service category to learn more or request advice:',
        'View Services',
        [
          {
            title: 'Our Core Offerings',
            rows: [
              { id: 'srv_sip', title: 'SIP & Mutual Funds', description: 'Wealth accumulation & goal planning' },
              { id: 'srv_insurance', title: 'Insurance Solutions', description: 'Term life, health & term protection' },
              { id: 'srv_loans', title: 'Loans & Credit Advisory', description: 'Home, business & personal financing' },
              { id: 'srv_retirement', title: 'Retirement & Wealth', description: 'Pension planning & capital preservation' },
            ],
          },
        ]
      );
      await this.supabase.updateSession(to, 'SERVICES', payload);
    } else if (input === 'opt_appointment' || input.includes('2') || input.toLowerCase().includes('book')) {
      const msg = `Please reply with your preferred date for the appointment (e.g., *2026-10-15* or *Tomorrow*):`;
      await this.metaClient.sendTextMessage(to, msg);
      await this.supabase.updateSession(to, 'APPOINTMENT_DATE', { ...payload, flow_type: 'appointment' });
    } else if (input === 'opt_contact' || input.includes('3') || input.toLowerCase().includes('location')) {
      const msg =
        `📍 *Sanchay Path Office Location*\n` +
        `Suite 402, Financial Tower, MG Road, Bengaluru - 560001\n\n` +
        `📞 *Phone*: +91 98765 43210\n` +
        `✉️ *Email*: info@sanchaypath.com\n` +
        `🕒 *Hours*: Mon - Sat: 9:30 AM - 6:30 PM`;
      await this.metaClient.sendTextMessage(to, msg);
      await this.sendMainMenuOptions(to);
    } else {
      await this.sendMainMenuOptions(to);
    }
  }

  private async handleServicesMenu(to: string, input: string, payload: SessionPayload): Promise<void> {
    let serviceName = 'SIP & Mutual Funds';

    if (input === 'srv_sip') serviceName = 'SIP & Mutual Funds';
    else if (input === 'srv_insurance') serviceName = 'Insurance Solutions';
    else if (input === 'srv_loans') serviceName = 'Loans & Credit Advisory';
    else if (input === 'srv_retirement') serviceName = 'Retirement & Wealth Management';

    const updatedPayload = { ...payload, selected_service: serviceName, flow_type: 'enquiry' as const };

    const msg = `You selected *${serviceName}*.\n\nTo help our advisor assist you, please enter your *Full Name*:`;
    await this.metaClient.sendTextMessage(to, msg);
    await this.supabase.updateSession(to, 'COLLECT_NAME', updatedPayload);
  }

  private async handleCollectName(to: string, input: string, payload: SessionPayload): Promise<void> {
    const updatedPayload = { ...payload, name: input, phone: to };
    const msg = `Thank you, *${input}*!\n\nPlease reply with your *Email Address* (or reply *Skip* if you prefer not to share):`;
    await this.metaClient.sendTextMessage(to, msg);
    await this.supabase.updateSession(to, 'COLLECT_EMAIL', updatedPayload);
  }

  private async handleCollectEmail(to: string, input: string, payload: SessionPayload): Promise<void> {
    const email = input.toLowerCase() === 'skip' ? '' : input;
    const updatedPayload = { ...payload, email };
    const msg = `Got it! Lastly, please enter your *City / Location*:`;
    await this.metaClient.sendTextMessage(to, msg);
    await this.supabase.updateSession(to, 'COLLECT_LOCATION', updatedPayload);
  }

  private async handleCollectLocation(to: string, input: string, payload: SessionPayload): Promise<void> {
    const updatedPayload = { ...payload, location: input };
    await this.showConfirmationSummary(to, updatedPayload);
  }

  private async handleAppointmentDate(to: string, input: string, payload: SessionPayload): Promise<void> {
    const updatedPayload = { ...payload, preferred_date: input };
    const msg = `Preferred date set to: *${input}*.\n\nPlease select your preferred *Time Slot*:`;
    await this.metaClient.sendInteractiveButtons(to, msg, [
      { id: 'time_morning', title: '🌅 Morning (10-12)' },
      { id: 'time_afternoon', title: '☀️ Afternoon (2-4)' },
      { id: 'time_evening', title: '🌆 Evening (4-6)' },
    ]);
    await this.supabase.updateSession(to, 'APPOINTMENT_TIME', updatedPayload);
  }

  private async handleAppointmentTime(to: string, input: string, payload: SessionPayload): Promise<void> {
    let slot = 'Morning (10 AM - 12 PM)';
    if (input === 'time_afternoon') slot = 'Afternoon (2 PM - 4 PM)';
    else if (input === 'time_evening') slot = 'Evening (4 PM - 6 PM)';

    const updatedPayload = { ...payload, preferred_time: slot };
    const msg = `Selected slot: *${slot}*.\n\nPlease reply with your *Full Name* to confirm the booking:`;
    await this.metaClient.sendTextMessage(to, msg);
    await this.supabase.updateSession(to, 'COLLECT_NAME', updatedPayload);
  }

  private async showConfirmationSummary(to: string, payload: SessionPayload): Promise<void> {
    const summary =
      `📋 *Please Confirm Your Details*\n\n` +
      `• *Type*: ${payload.flow_type === 'appointment' ? 'Appointment Request' : 'Service Enquiry'}\n` +
      (payload.selected_service ? `• *Service*: ${payload.selected_service}\n` : '') +
      `• *Name*: ${payload.name || 'N/A'}\n` +
      `• *Phone*: ${to}\n` +
      (payload.email ? `• *Email*: ${payload.email}\n` : '') +
      (payload.location ? `• *Location*: ${payload.location}\n` : '') +
      (payload.preferred_date ? `• *Date*: ${payload.preferred_date}\n` : '') +
      (payload.preferred_time ? `• *Time*: ${payload.preferred_time}\n` : '');

    await this.metaClient.sendInteractiveButtons(to, summary, [
      { id: 'confirm_yes', title: '✅ Confirm & Submit' },
      { id: 'confirm_cancel', title: '❌ Cancel' },
    ]);

    await this.supabase.updateSession(to, 'CONFIRM_DATA', payload);
  }

  private async handleConfirmData(to: string, input: string, payload: SessionPayload): Promise<void> {
    if (input === 'confirm_yes' || input.toLowerCase().includes('yes')) {
      // Create Customer
      const customerId = await this.supabase.upsertCustomer({
        phone: to,
        name: payload.name,
        email: payload.email,
        location: payload.location,
      });

      if (payload.flow_type === 'appointment') {
        await this.supabase.createAppointment({
          customer_id: customerId,
          service: payload.selected_service || 'Financial Advisory',
          preferred_date: payload.preferred_date || new Date().toISOString().split('T')[0],
          preferred_time: payload.preferred_time || 'Morning',
        });
      } else {
        await this.supabase.createEnquiry({
          customer_id: customerId,
          service: payload.selected_service || 'General Enquiry',
          message: `Enquiry submitted via WhatsApp Bot for ${payload.selected_service || 'Financial Advisory'}`,
        });
      }

      const successMsg =
        `🎉 *Thank You! Your Request Has Been Received.*\n\n` +
        `Our Sanchay Path financial advisor will review your details and contact you shortly.\n\n` +
        `Type *Menu* anytime to return to the main menu.`;

      await this.metaClient.sendTextMessage(to, successMsg);
      await this.supabase.updateSession(to, 'COMPLETED', {});
    } else {
      const cancelMsg = `Request cancelled. Type *Menu* to return to main menu.`;
      await this.metaClient.sendTextMessage(to, cancelMsg);
      await this.supabase.updateSession(to, 'MAIN_MENU', {});
    }
  }

  private async transitionTo(to: string, state: WhatsAppSession['current_state'], payload: SessionPayload): Promise<void> {
    await this.supabase.updateSession(to, state, payload);
    if (state === 'MAIN_MENU') {
      await this.sendMainMenuOptions(to);
    }
  }
}
