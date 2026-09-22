import { NextResponse } from 'next/server';
import { getResend, EMAIL_FROM, ADMIN_EMAIL } from '@/lib/resend';

type EmailType = 'contact' | 'quote' | 'purchase';

interface EmailPayload {
  to: string;
  type: EmailType;
  language: 'es' | 'en';
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

export async function POST(request: Request) {
  try {
    const body: EmailPayload = await request.json();
    const { to, type, language = 'es', orderData } = body;
    const isEn = language === 'en';
    const resend = getResend();

    // ============================================================
    // CONTACTO
    // ============================================================
    if (type === 'contact') {
      const { name, company, email, phone, message } = body;

      const adminHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'New Contact Message' : 'Nuevo mensaje de contacto'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p><strong>${isEn ? 'Name:' : 'Nombre:'}</strong> ${name || '-'}</p>
            <p><strong>${isEn ? 'Company:' : 'Compañía:'}</strong> ${company || '-'}</p>
            <p><strong>Email:</strong> ${email || '-'}</p>
            <p><strong>${isEn ? 'Phone:' : 'Teléfono:'}</strong> ${phone || '-'}</p>
            <p><strong>${isEn ? 'Message:' : 'Mensaje:'}</strong></p>
            <p style="background:#FFFFFF;padding:16px;border-radius:8px;border:1px solid #E5E5E5;">${message || '-'}</p>
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
            <p>${isEn ? 'We have received your message and will contact you soon.' : 'Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.'}</p>
            <p style="color:#808080;margin-top:24px;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      // FWD al admin
      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn ? '[FWD] New Contact Message - AxBYTE' : '[FWD] Nuevo mensaje de contacto - AxBYTE',
          html: adminHTML,
        });
      }

      // Confirmación al cliente
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: isEn ? 'Message Received - AxBYTE' : 'Mensaje recibido - AxBYTE',
        html: clientHTML,
      });

      return NextResponse.json({ success: true });
    }

    // ============================================================
    // COTIZACIÓN PERSONALIZADA
    // ============================================================
    if (type === 'quote') {
      const { name, email, quoteId, amount } = body;

      const adminHTML = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5;">
          <div style="background:linear-gradient(135deg,#F5C7B1,#D9F0D3);padding:32px;text-align:center;">
            <h1 style="color:#1A1A1A;margin:0;font-size:24px;">
              ${isEn ? 'New Custom Quote' : 'Nueva cotización personalizada'}
            </h1>
          </div>
          <div style="padding:32px;color:#1A1A1A;">
            <p><strong>${isEn ? 'Quote ID:' : 'ID de Cotización:'}</strong> ${quoteId || '-'}</p>
            <p><strong>Email:</strong> ${email || '-'}</p>
            <p><strong>${isEn ? 'Amount:' : 'Monto:'}</strong> MXN$${Number(amount || 0).toFixed(2)}</p>
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
            <p>${isEn ? 'We have received your quote request and added it to your cart.' : 'Hemos recibido tu solicitud de cotización y la hemos agregado a tu carrito.'}</p>
            <p><strong>${isEn ? 'Quote ID:' : 'ID de Cotización:'}</strong> ${quoteId || '-'}</p>
            <p><strong>${isEn ? 'Amount:' : 'Monto:'}</strong> MXN$${Number(amount || 0).toFixed(2)}</p>
          </div>
        </div>`;

      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn ? '[FWD] New Custom Quote - AxBYTE' : '[FWD] Nueva cotización personalizada - AxBYTE',
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
      const productosRows = orderData.productos
        .map(
          (p) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #E5E5E5;color:#1A1A1A;">
            ${p.nombre} × ${p.cantidad}
          </td>
          <td style="padding:10px;border-bottom:1px solid #E5E5E5;text-align:right;color:#1A1A1A;">
            MXN$${(p.precio * p.cantidad).toFixed(2)}
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
            <p>${isEn ? 'Your order has been processed successfully.' : 'Tu pedido ha sido procesado correctamente.'}</p>
            <h2 style="font-size:18px;border-bottom:2px solid #F5C7B1;padding-bottom:8px;">
              ${isEn ? 'Order Summary' : 'Resumen de tu pedido'}
            </h2>
            <table style="width:100%;border-collapse:collapse;">${productosRows}</table>
            <div style="margin-top:20px;padding:20px;background:#F5C7B1;border-radius:12px;">
              <p style="margin:6px 0;"><strong>${isEn ? 'Subtotal:' : 'Subtotal:'}</strong> MXN$${orderData.subtotal.toFixed(2)}</p>
              ${orderData.descuento > 0 ? `<p style="margin:6px 0;"><strong>${isEn ? 'Discount:' : 'Descuento:'}</strong> -MXN$${orderData.descuento.toFixed(2)}</p>` : ''}
              <p style="margin:6px 0;"><strong>${isEn ? 'VAT (16%):' : 'IVA (16%):'}</strong> MXN$${orderData.impuesto.toFixed(2)}</p>
              <p style="margin:12px 0 0;font-size:20px;"><strong>${isEn ? 'Total:' : 'Total:'}</strong> MXN$${orderData.total.toFixed(2)}</p>
              ${orderData.cupon ? `<p style="margin:6px 0;"><strong>${isEn ? 'Coupon:' : 'Cupón:'}</strong> ${orderData.cupon}</p>` : ''}
            </div>
            <p style="color:#808080;margin-top:20px;">
              <strong>${isEn ? 'Transaction:' : 'Transacción:'}</strong> ${orderData.transactionId}
            </p>
            <p>${isEn ? 'Thank you for your purchase at' : 'Gracias por tu compra en'} <strong>AxBYTE Creative Solutions</strong>.</p>
          </div>
          <div style="background:#F5C7B1;padding:16px;text-align:center;">
            <p style="color:#1A1A1A;font-size:12px;margin:0;">AxBYTE Creative Solutions - soluciones@axbyte.com.mx</p>
          </div>
        </div>`;

      // Email al cliente
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: isEn ? 'Purchase Confirmed! - AxBYTE' : '¡Compra confirmada! - AxBYTE',
        html: orderHTML,
      });

      // FWD al admin
      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: isEn ? `[FWD] New Purchase - ${orderData.nombre}` : `[FWD] Nueva compra - ${orderData.nombre}`,
          html: orderHTML,
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al enviar correo' },
      { status: 500 }
    );
  }
}