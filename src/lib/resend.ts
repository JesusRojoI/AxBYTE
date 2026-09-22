import { Resend } from 'resend';

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY no está configurado');
  return new Resend(apiKey);
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'gestion@axbyte.com.mx';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';