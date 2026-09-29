/**
 * Helpers de seguridad para APIs: origin check, honeypot, timing, email check.
 */

import crypto from 'crypto';

const SECRET = process.env.FORM_SECRET || 'axbyte-default-form-secret-change-me';

const ALLOWED_ORIGINS = [
  'https://axbyte.com.mx',
  'https://www.axbyte.com.mx',
  'http://localhost:3022',
  'http://localhost:3000',
];

// ============================================================
// CAPA 1: VALIDACIÓN DE ORIGIN / REFERER
// ============================================================

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // En algunos casos el navegador no envía origin (curl, bots simples).
  // Si no viene, rechazamos por seguridad.
  if (!origin && !referer) return false;

  const checkUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const u = new URL(url);
      return ALLOWED_ORIGINS.includes(`${u.protocol}//${u.host}`);
    } catch {
      return false;
    }
  };

  if (origin && !checkUrl(origin)) return false;
  if (referer && !checkUrl(referer)) return false;

  return true;
}

// ============================================================
// CAPA 2: HONEYPOT FIELD
// ============================================================

/**
 * El frontend envía un campo "_website" que debe venir VACÍO.
 * Si viene con valor → es un bot rellenando todos los campos.
 * El formulario lo oculta con CSS (no con `type=hidden`).
 */
export function isHoneypotTripped(body: any): boolean {
  const value = body?._website || body?.website;
  return typeof value === 'string' && value.trim().length > 0;
}

// ============================================================
// CAPA 3: TIME-BASED VALIDATION
// ============================================================

/**
 * Genera un token firmado con el timestamp de render del formulario.
 * El token se envía en el body. El servidor verifica:
 *   - La firma es válida
 *   - Han pasado al menos MIN_ELAPSED_MS desde que se generó
 *   - No ha pasado más de MAX_ELAPSED_MS (evita replay de tokens antiguos)
 */
const MIN_ELAPSED_MS = 3000; // 3 segundos mínimo
const MAX_ELAPSED_MS = 2 * 60 * 60 * 1000; // 2 horas máximo

export function generateFormToken(): string {
  const ts = Date.now().toString();
  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(ts)
    .digest('hex');
  return `${ts}.${sig}`;
}

export interface FormTokenResult {
  valid: boolean;
  reason?: string;
  elapsed?: number;
}

export function validateFormToken(token: string | undefined): FormTokenResult {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'malformed' };

  const [ts, sig] = parts;

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(ts)
    .digest('hex');

  // Comparación en tiempo constante
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');
  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    return { valid: false, reason: 'invalid_signature' };
  }

  const tsNum = parseInt(ts, 10);
  if (isNaN(tsNum)) return { valid: false, reason: 'invalid_timestamp' };

  const elapsed = Date.now() - tsNum;

  if (elapsed < MIN_ELAPSED_MS) {
    return { valid: false, reason: 'too_fast', elapsed };
  }
  if (elapsed > MAX_ELAPSED_MS) {
    return { valid: false, reason: 'expired', elapsed };
  }

  return { valid: true, elapsed };
}

// ============================================================
// CAPA 4: DETECCIÓN DE EMAILS DESECHABLES
// ============================================================

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'temp-mail.org',
  'fakeinbox.com',
  'maildrop.cc',
  'mintemail.com',
  'mytemp.email',
  'spam4.me',
  'tempr.email',
  'discard.email',
  'mailnesia.com',
  'tempinbox.com',
  'throwaway.email',
]);

export function isDisposableEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

// ============================================================
// CAPA 5: VALIDACIÓN DE EMAIL BÁSICA
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

// ============================================================
// CAPA 6: LIMPIEZA DE STRINGS (evita inyecciones)
// ============================================================

export function sanitizeString(input: any, maxLength = 5000): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\u0000-\u001F\u007F]/g, ''); // elimina caracteres de control
}

export function containsSuspiciousContent(text: string): boolean {
  if (!text) return false;
  // URLs sospechosas, spam patterns comunes
  const patterns = [
    /\b(viagra|cialis|casino|porn|xxx|bitcoin\s*giveaway|crypto\s*invest)\b/i,
    /https?:\/\/[^\s]+\.(ru|tk|ml|ga|cf|top|work|click)\b/i,
    /\b\d{13,19}\b/, // números largos (tarjetas de crédito no deseadas)
  ];
  return patterns.some((p) => p.test(text));
}