

interface Bucket {
  timestamps: number[];
}

const store = new Map<string, Bucket>();

// Limpieza periódica para evitar leaks de memoria
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 min
const MAX_AGE = 60 * 60 * 1000; // 1 hora

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, bucket] of store.entries()) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < MAX_AGE);
    if (bucket.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Identificador único del scope (ej: "contact", "quote", "purchase") */
  scope: string;
  /** Máximo de peticiones permitidas en la ventana */
  limit: number;
  /** Tamaño de la ventana en milisegundos */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // ms hasta que se libere un slot
  total: number;
}

export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const key = `${config.scope}:${ip}`;
  const now = Date.now();

  let bucket = store.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    store.set(key, bucket);
  }

  // Eliminar timestamps fuera de la ventana
  bucket.timestamps = bucket.timestamps.filter(
    (t) => now - t < config.windowMs
  );

  const count = bucket.timestamps.length;

  if (count >= config.limit) {
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetIn: config.windowMs - (now - oldest),
      total: count,
    };
  }

  bucket.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.limit - count - 1,
    resetIn: config.windowMs,
    total: count + 1,
  };
}

/**
 * Configuraciones predefinidas por tipo de endpoint.
 * Ajustadas para bloquear ataques sin afectar UX legítima.
 */
export const RATE_LIMITS = {
  // Formulario de contacto: muy abusable
  contact: { scope: 'contact', limit: 3, windowMs: 15 * 60 * 1000 }, // 3 / 15 min
  // Formulario de cotización: similar
  quote: { scope: 'quote', limit: 3, windowMs: 15 * 60 * 1000 }, // 3 / 15 min
  // Compra: menos restrictivo (usuario legítimo puede comprar varias veces)
  purchase: { scope: 'purchase', limit: 10, windowMs: 15 * 60 * 1000 }, // 10 / 15 min
  // Payment: 5 intentos por 15 min (evita fuerza bruta)
  payment: { scope: 'payment', limit: 5, windowMs: 15 * 60 * 1000 }, // 5 / 15 min
  // Global por IP (todos los endpoints combinados)
  global: { scope: 'global', limit: 20, windowMs: 15 * 60 * 1000 }, // 20 / 15 min
} as const;

/**
 * Extrae la IP del cliente de los headers.
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;

  // Cloudflare
  const cf = headers.get('cf-connecting-ip');
  if (cf) return cf;

  // Vercel / proxies
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const xri = headers.get('x-real-ip');
  if (xri) return xri;

  // Fallback (no disponible en serverless de Next.js)
  return 'unknown';
}