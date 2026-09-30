import { NextResponse } from 'next/server';
import { getResend, EMAIL_FROM, ADMIN_EMAIL } from '@/lib/resend';
import {
  checkRateLimit,
  getClientIP,
  RATE_LIMITS,
  type RateLimitConfig,
} from '@/lib/rate-limit';
import {
  isAllowedOrigin,
  isHoneypotTripped,
  validateFormToken,
  isDisposableEmail,
  isValidEmail,
  sanitizeString,
  containsSuspiciousContent,
} from '@/lib/security';

type EmailType = 'contact' | 'quote' | 'purchase';

interface EmailPayload {
  to: string;
  type: EmailType;
  language: 'es' | 'en';
  _website?: string;
  _token?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  quoteId?: string;
  amount?: number;
  orderData?: {
    nombre: string;
    apellido?: string;
    email: string;
    telefono?: string;
    productos: Array<{ nombre: string; cantidad: number; precio: number }>;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    cupon?: string;
    transactionId: string;
  };
}

/**
 * Respuesta genérica para no dar pistas a atacantes sobre por qué se bloqueó.
 */
function blockedResponse(status = 200) {
  return NextResponse.json(
    { success: false, error: 'Request rejected' },
    { status }
  );
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);

    // ============================================================
    // CAPA 1: RATE LIMITING GLOBAL
    // ============================================================
    const globalLimit = checkRateLimit(ip, RATE_LIMITS.global);
    if (!globalLimit.allowed) {
      console.warn(`[SECURITY] Global rate limit exceeded for IP ${ip}`);
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(globalLimit.resetIn / 1000).toString(),
          },
        }
      );
    }

    // ============================================================
    // CAPA 2: VALIDACIÓN DE ORIGIN
    // ============================================================
    if (!isAllowedOrigin(request)) {
      console.warn(
        `[SECURITY] Invalid origin from IP ${ip}: ${request.headers.get('origin')}`
      );
      return blockedResponse();
    }

    const body: EmailPayload = await request.json();

    // ============================================================
    // CAPA 3: HONEYPOT
    // ============================================================
    if (isHoneypotTripped(body)) {
      console.warn(`[SECURITY] Honeypot tripped by IP ${ip}`);
      return blockedResponse();
    }

    // ============================================================
    // CAPA 4: TIME-BASED TOKEN
    // ============================================================
    const tokenCheck = validateFormToken(body._token);
    if (!tokenCheck.valid) {
      console.warn(
        `[SECURITY] Invalid form token from IP ${ip}: ${tokenCheck.reason}`
      );
      return blockedResponse();
    }

    // ============================================================
    // CAPA 5: RATE LIMIT POR TIPO
    // ============================================================
    const typeLimits: Record<EmailType, RateLimitConfig> = {
      contact: RATE_LIMITS.contact,
      quote: RATE_LIMITS.quote,
      purchase: RATE_LIMITS.purchase,
    };
    const typeLimit = checkRateLimit(ip, typeLimits[body.type]);
    if (!typeLimit.allowed) {
      console.warn(
        `[SECURITY] Type rate limit exceeded (${body.type}) for IP ${ip}`
      );
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(typeLimit.resetIn / 1000).toString(),
          },
        }
      );
    }

    const { to, type, language = 'es', orderData } = body;
    const isEn = language === 'en';

    // ============================================================
    // CAPA 6: VALIDACIÓN DE EMAIL
    // ============================================================
    if (!isValidEmail(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    if (isDisposableEmail(to)) {
      console.warn(`[SECURITY] Disposable email blocked: ${to} from IP ${ip}`);
      return blockedResponse();
    }

    // Validar contenido sospechoso
    if (type === 'contact' && body.message) {
      if (containsSuspiciousContent(body.message)) {
        console.warn(`[SECURITY] Suspicious content from IP ${ip}`);
        return blockedResponse();
      }
    }

    const resend = getResend();

    // ============================================================
    // CONTACTO
    // ============================================================
    if (type === 'contact') {
      const name = sanitizeString(body.name, 200);
      const company = sanitizeString(body.company, 200);
      const email = sanitizeString(body.email, 254);
      const phone = sanitizeString(body.phone, 50);
      const message = sanitizeString(body.message, 5000);

      if (!name || !isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Filas condicionales — solo se muestran si tienen contenido
      const rows = [
        `<p><strong>${isEn ? 'Name:' : 'Nombre:'}</strong> ${name}</p>`,
        company
          ? `<p><strong>${isEn ? 'Company:' : 'Compañía:'}</strong> ${company}</p>`
          : '',
        `<p><strong>Email:</strong> ${email}</p>`,
        phone
          ? `<p><strong>${isEn ? 'Phone:' : 'Teléfono:'}</strong> ${phone}</p>`
          : '',
      ]
        .filter(Boolean)
        .join('');

      const adminHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'New Contact Message' : 'Nuevo mensaje de contacto'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            ${rows}
            ${
              message
                ? `<p><strong>${isEn ? 'Message:' : 'Mensaje:'}</strong></p>
                   <p style="background:#FFFFFF;padding:16px;border-radius:8px;border:1px solid #E5E5E5;">${message}</p>`
                : ''
            }
            <p style="color:#808080;font-size:12px;margin-top:24px;">
              IP: ${ip} · ${new Date().toISOString()}
            </p>
          </div>
          <div style="background:#F5C7B1;padding:16px;text-align:center;">
            <p style="color:#1A1A1A;font-size:12px;margin:0;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      const clientHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'Message Received' : 'Mensaje recibido'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p>${isEn ? `Hello <strong>${name}</strong>,` : `Hola <strong>${name}</strong>,`}</p>
            <p>${isEn ? 'We received your message and will get in touch with you soon.' : 'Recibimos tu mensaje y nos pondremos en contacto contigo pronto.'}</p>
            <p style="margin-top:24px;"><strong>${isEn ? 'Your email:' : 'Su correo:'}</strong> ${email}</p>
            <p style="color:#808080;margin-top:16px;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn
            ? '[FWD] New Contact Message - AxBYTE'
            : '[FWD] Nuevo mensaje de contacto - AxBYTE',
          html: adminHTML,
        });
      }

      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: isEn ? 'Message Received - AxBYTE' : 'Mensaje recibido - AxBYTE',
        html: clientHTML,
      });

      return NextResponse.json({ success: true });
    }

    // ============================================================
    // COTIZACIÓN
    // ============================================================
    if (type === 'quote') {
      const email = sanitizeString(body.email, 254);
      const quoteId = sanitizeString(body.quoteId, 100);
      const amount = Number(body.amount);

      if (!email || !quoteId || isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const adminHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'New Custom Quote' : 'Nueva cotización personalizada'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p><strong>${isEn ? 'Quote ID:' : 'ID de Cotización:'}</strong> ${quoteId}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>${isEn ? 'Amount:' : 'Monto:'}</strong> MXN$${amount.toFixed(2)}</p>
            <p style="color:#808080;font-size:12px;margin-top:24px;">
              IP: ${ip} · ${new Date().toISOString()}
            </p>
          </div>
          <div style="background:#F5C7B1;padding:16px;text-align:center;">
            <p style="color:#1A1A1A;font-size:12px;margin:0;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      const clientHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'Quote Received' : 'Cotización recibida'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p>${isEn ? 'Hello,' : 'Hola,'}</p>
            <p>${isEn ? 'We received your quote request and added it to your cart.' : 'Recibimos tu solicitud de cotización y la agregamos a tu carrito.'}</p>
            <p><strong>${isEn ? 'Quote ID:' : 'ID de Cotización:'}</strong> ${quoteId}</p>
            <p><strong>${isEn ? 'Amount:' : 'Monto:'}</strong> MXN$${amount.toFixed(2)}</p>
          </div>
        </div>`;

      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn
            ? '[FWD] New Custom Quote - AxBYTE'
            : '[FWD] Nueva cotización personalizada - AxBYTE',
          html: adminHTML,
        });
      }

      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: isEn ? 'Quote Received - AxBYTE' : 'Cotización recibida - AxBYTE',
        html: clientHTML,
      });

      return NextResponse.json({ success: true });
    }

    // ============================================================
    // COMPRA
    // ============================================================
    if (type === 'purchase' && orderData) {
      if (
        !orderData.productos ||
        !Array.isArray(orderData.productos) ||
        orderData.productos.length === 0 ||
        orderData.productos.length > 50
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid order' },
          { status: 400 }
        );
      }

      const productosRows = orderData.productos
        .map(
          (p) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #E5E5E5;color:#1A1A1A;">
            ${sanitizeString(p.nombre, 200)} × ${Number(p.cantidad) || 0}
          </td>
          <td style="padding:10px;border-bottom:1px solid #E5E5E5;text-align:right;color:#1A1A1A;">
            MXN$${((Number(p.precio) || 0) * (Number(p.cantidad) || 0)).toFixed(2)}
          </td>
        </tr>`
        )
        .join('');

      const orderHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:26px;">
              ${isEn ? 'Purchase Confirmed!' : '¡Compra confirmada!'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p style="font-size:16px;">
              ${isEn ? `Hello <strong>${orderData.nombre}</strong>,` : `Hola <strong>${orderData.nombre}</strong>,`}
            </p>
            <p>${isEn ? 'Your order went through successfully.' : 'Tu pedido se procesó correctamente.'}</p>
            <p style="margin:12px 0;"><strong>${isEn ? 'Your email:' : 'Su correo:'}</strong> ${sanitizeString(orderData.email, 254)}</p>
            <h2 style="font-size:18px;border-bottom:2px solid #F5C7B1;padding-bottom:8px;">
              ${isEn ? 'Order Summary' : 'Resumen de tu pedido'}
            </h2>
            <table style="width:100%;border-collapse:collapse;">${productosRows}</table>
            <div style="margin-top:20px;padding:20px;background:#F5C7B1;border-radius:12px;">
              <p style="margin:6px 0;"><strong>${isEn ? 'Subtotal:' : 'Subtotal:'}</strong> MXN$${Number(orderData.subtotal).toFixed(2)}</p>
              ${orderData.descuento > 0 ? `<p style="margin:6px 0;"><strong>${isEn ? 'Discount:' : 'Descuento:'}</strong> -MXN$${Number(orderData.descuento).toFixed(2)}</p>` : ''}
              <p style="margin:6px 0;"><strong>${isEn ? 'VAT (16%):' : 'IVA (16%):'}</strong> MXN$${Number(orderData.impuesto).toFixed(2)}</p>
              <p style="margin:12px 0 0;font-size:20px;"><strong>${isEn ? 'Total:' : 'Total:'}</strong> MXN$${Number(orderData.total).toFixed(2)}</p>
              ${orderData.cupon ? `<p style="margin:6px 0;"><strong>${isEn ? 'Coupon:' : 'Cupón:'}</strong> ${sanitizeString(orderData.cupon, 50)}</p>` : ''}
            </div>
            <p style="color:#808080;margin-top:20px;">
              <strong>${isEn ? 'Transaction:' : 'Transacción:'}</strong> ${sanitizeString(orderData.transactionId, 100)}
            </p>
            <p>${isEn ? 'Thank you for your purchase at' : 'Gracias por tu compra en'} <strong>AxBYTE Creative Solutions</strong>.</p>
          </div>
          <div style="background:#F5C7B1;padding:16px;text-align:center;">
            <p style="color:#1A1A1A;font-size:12px;margin:0;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: isEn
          ? 'Purchase Confirmed! - AxBYTE'
          : '¡Compra confirmada! - AxBYTE',
        html: orderHTML,
      });

      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn
            ? `[FWD] New Purchase - ${sanitizeString(orderData.nombre, 100)}`
            : `[FWD] Nueva compra - ${sanitizeString(orderData.nombre, 100)}`,
          html: orderHTML,
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing request' },
      { status: 500 }
    );
  }
}