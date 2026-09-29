import { NextResponse } from 'next/server';
import https from 'https';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit';
import {
  isAllowedOrigin,
  isHoneypotTripped,
  validateFormToken,
  isValidEmail,
  sanitizeString,
} from '@/lib/security';

interface PaymentData {
  amount: number;
  orderId: string;
  language?: 'es' | 'en';
  _website?: string;
  _token?: string;
  cardData: {
    number: string;
    name: string;
    month: string;
    year: string;
    cvv: string;
  };
  customer: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    direccion2?: string;
    ciudad: string;
    estado: string;
    pais?: string;
    cp: string;
    empresa?: string;
  };
  metadata?: { ip?: string; deviceId?: string; notes?: string };
}

const API_URL = 'https://pagos.keycop.com.mx/api/v1';

function httpsPost(
  path: string,
  body: any,
  authToken?: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);

    const headers: Record<string, string | number> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      Origin: 'https://axbyte.com.mx',
      Referer: 'https://axbyte.com.mx/',
    };

    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const options: https.RequestOptions = {
      method: 'POST',
      host: 'pagos.keycop.com.mx',
      port: 443,
      path,
      headers,
      servername: 'pagos.keycop.com.mx',
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      family: 4,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[HTTPS] ${path} → ${res.statusCode}`);
        let parsed: any = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = { raw: data };
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject({
            status: res.statusCode,
            response: { data: parsed, status: res.statusCode },
            message: parsed.message || `HTTP ${res.statusCode}`,
          });
        } else {
          resolve(parsed);
        }
      });
    });

    req.on('error', (err: NodeJS.ErrnoException) => {
      console.error(`[HTTPS ERROR] ${path}:`, err.message, err.code);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ message: 'Timeout al conectar con el servidor de pagos' });
    });

    req.write(payload);
    req.end();
  });
}

async function getAuthToken(): Promise<string> {
  const data = await httpsPost('/api/v1/signin', {
    email: process.env.KEYCOP_EMAIL,
    password: process.env.KEYCOP_PASSWORD,
  });
  if (!data.authToken) {
    throw new Error(
      data.message ||
        'El servidor de Keycop no devolvió authToken. Verifica tus credenciales en .env.local'
    );
  }
  return data.authToken;
}

async function tokenizeCard(
  token: string,
  payment: PaymentData
): Promise<string> {
  const card = payment.cardData;
  const data = await httpsPost(
    '/api/v1/card/tokenizer',
    {
      cardData: {
        cardNumber: card.number.replace(/\s/g, ''),
        cardholderName: sanitizeString(card.name, 200),
        expirationMonth: card.month,
        expirationYear: card.year,
      },
    },
    token
  );
  if (!data.cardNumberToken) {
    throw new Error(data.message || 'No se pudo tokenizar la tarjeta.');
  }
  return data.cardNumberToken;
}

async function executeSale(
  token: string,
  cardToken: string,
  payment: PaymentData
) {
  const salePayload = {
    amount: Number(payment.amount),
    currency: '484',
    reference: payment.orderId,
    customerInformation: {
      firstName: sanitizeString(payment.customer.nombre, 100),
      lastName: sanitizeString(payment.customer.apellido, 100),
      phone1: sanitizeString(payment.customer.telefono, 20),
      email: sanitizeString(payment.customer.email, 254),
      city: sanitizeString(payment.customer.ciudad, 100),
      address1: sanitizeString(payment.customer.direccion, 200),
      address2: sanitizeString(payment.customer.direccion2 || '', 200),
      postalCode: sanitizeString(payment.customer.cp, 10),
      state: sanitizeString(payment.customer.estado, 100),
      country: payment.customer.pais || 'MX',
      ip: payment.metadata?.ip || '127.0.0.1',
    },
    cardData: {
      cardNumberToken: cardToken,
      cvv: payment.cardData.cvv,
    },
  };
  return await httpsPost('/api/v1/sale', salePayload, token);
}

const ERRORS = {
  es: {
    credentials: 'Credenciales de Keycop no configuradas.',
    invalidAmount: 'Monto inválido',
    incompleteCard: 'Datos de tarjeta incompletos',
    connectionError: 'Error de conexión con el procesador de pagos. Intenta nuevamente en unos minutos.',
    blocked: 'El procesador de pagos rechazó la solicitud. Contacta a soporte técnico.',
    generic: 'Error procesando el pago. Verifica los datos de tu tarjeta.',
    timeout: 'El servidor de pagos no responde. Intenta nuevamente.',
    network: 'Error de red al conectar con el procesador de pagos.',
    authFailed: 'Credenciales de Keycop inválidas. Contacta al administrador.',
    rateLimited: 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
  },
  en: {
    credentials: 'Keycop credentials not configured.',
    invalidAmount: 'Invalid amount',
    incompleteCard: 'Incomplete card data',
    connectionError: 'Connection error with the payment processor. Please try again in a few minutes.',
    blocked: 'The payment processor rejected the request. Contact technical support.',
    generic: 'Error processing payment. Please verify your card details.',
    timeout: 'The payment server is not responding. Please try again.',
    network: 'Network error connecting to the payment processor.',
    authFailed: 'Invalid Keycop credentials. Contact the administrator.',
    rateLimited: 'Too many attempts. Please wait a few minutes before trying again.',
  },
};

function blockedResponse(status = 200) {
  return NextResponse.json(
    { success: false, status: 'error', error: 'Request rejected' },
    { status }
  );
}

export async function POST(request: Request) {
  let lang: 'es' | 'en' = 'es';

  try {
    const ip = getClientIP(request);

    // ============================================================
    // SEGURIDAD: Rate limit global
    // ============================================================
    const globalLimit = checkRateLimit(ip, RATE_LIMITS.global);
    if (!globalLimit.allowed) {
      console.warn(`[SECURITY] Payment global rate limit exceeded: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          status: 'error',
          error: ERRORS[lang].rateLimited,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(globalLimit.resetIn / 1000).toString(),
          },
        }
      );
    }

    // ============================================================
    // SEGURIDAD: Origin check
    // ============================================================
    if (!isAllowedOrigin(request)) {
      console.warn(`[SECURITY] Payment invalid origin: ${ip}`);
      return blockedResponse();
    }

    const body: PaymentData = await request.json();
    lang = body.language === 'en' ? 'en' : 'es';
    const E = ERRORS[lang];

    // ============================================================
    // SEGURIDAD: Honeypot
    // ============================================================
    if (isHoneypotTripped(body)) {
      console.warn(`[SECURITY] Payment honeypot tripped: ${ip}`);
      return blockedResponse();
    }

    // ============================================================
    // SEGURIDAD: Time-based token
    // ============================================================
    const tokenCheck = validateFormToken(body._token);
    if (!tokenCheck.valid) {
      console.warn(`[SECURITY] Payment invalid token: ${tokenCheck.reason} from ${ip}`);
      return blockedResponse();
    }

    // ============================================================
    // SEGURIDAD: Rate limit de pagos (más estricto)
    // ============================================================
    const paymentLimit = checkRateLimit(ip, RATE_LIMITS.payment);
    if (!paymentLimit.allowed) {
      console.warn(`[SECURITY] Payment rate limit exceeded: ${ip}`);
      return NextResponse.json(
        { success: false, status: 'error', error: E.rateLimited },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(paymentLimit.resetIn / 1000).toString(),
          },
        }
      );
    }

    // ============================================================
    // VALIDACIONES DE NEGOCIO
    // ============================================================
    if (!process.env.KEYCOP_EMAIL || !process.env.KEYCOP_PASSWORD) {
      return NextResponse.json(
        { success: false, error: E.credentials },
        { status: 500 }
      );
    }
    if (!body.amount || body.amount <= 0 || body.amount > 1_000_000) {
      return NextResponse.json(
        { success: false, error: E.invalidAmount },
        { status: 400 }
      );
    }
    if (!body.cardData?.number || !body.cardData?.cvv) {
      return NextResponse.json(
        { success: false, error: E.incompleteCard },
        { status: 400 }
      );
    }
    if (!isValidEmail(body.customer?.email || '')) {
      return NextResponse.json(
        { success: false, error: E.generic },
        { status: 400 }
      );
    }

    // 1. Auth
    const authToken = await getAuthToken();

    // 2. Tokenize
    const cardToken = await tokenizeCard(authToken, body);

    // 3. Sale
    const data = await executeSale(authToken, cardToken, body);

    const status = data?.status || '';
    const isApproved =
      status === 'APPROVED' ||
      status === 'approved' ||
      status === 'Approved';

    return NextResponse.json({
      success: isApproved,
      orderId: data?.orderId || data?.id || body.orderId,
      reference: data?.reference,
      status,
      data,
    });
  } catch (error: any) {
    console.error('=== ERROR EN PROCESO DE PAGO ===');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.status);

    const E = ERRORS[lang];
    let userMessage = E.generic;

    if (error.message?.includes('authToken') || error.message?.includes('password')) {
      userMessage = E.authFailed;
    } else if (error.status === 403 || error.message?.includes('403')) {
      userMessage = E.blocked;
    } else if (error.code === 'EPROTO' || error.message?.includes('EPROTO')) {
      userMessage = E.connectionError;
    } else if (error.message?.toLowerCase().includes('timeout')) {
      userMessage = E.timeout;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      userMessage = E.network;
    } else if (error.response?.data?.message) {
      userMessage = error.response.data.message;
    }

    return NextResponse.json(
      { success: false, status: 'error', error: userMessage },
      { status: 500 }
    );
  }
}