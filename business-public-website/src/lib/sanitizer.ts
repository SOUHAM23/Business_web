/**
 /**
 * Server-side Input Sanitization & Anti-XSS Utilities
 */

export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Remove non-digit characters except leading plus
  return phone.replace(/[^\d+]/g, '').trim();
}

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
