'use server';

import axios from 'axios';

const API_URL = process.env.KEYCOP_API_URL || 'https://pagos.keycop.com.mx/api/v1';

export interface PaymentData {
  amount: number;
  orderId: string;
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
  metadata?: {
    ip?: string;
    deviceId?: string;
    notes?: string;
  };
}

async function getAuthToken(): Promise<string> {
  const email = process.env.KEYCOP_EMAIL;
  const password = process.env.KEYCOP_PASSWORD;
  if (!email || !password) throw new Error('Credenciales Keycop no configuradas');

  const { data } = await axios.post(`${API_URL}/signin`, { email, password });
  return data.authToken;
}

async function tokenizeCard(token: string, payment: PaymentData): Promise<string> {
  const card = payment.cardData;
  const { data } = await axios.post(
    `${API_URL}/card/tokenizer`,
    {
      cardData: {
        cardNumber: card.number.replace(/\s/g, ''),
        cardholderName: card.name,
        expirationYear: card.year,
        expirationMonth: card.month,
      },
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.cardNumberToken;
}

export async function processKeycopPayment(payment: PaymentData) {
  try {
    const authToken = await getAuthToken();
    const cardToken = await tokenizeCard(authToken, payment);

    const salePayload = {
      amount: Number(payment.amount),
      currency: '484',
      reference: payment.orderId,
      customerInformation: {
        firstName: payment.customer.nombre,
        lastName: payment.customer.apellido,
        email: payment.customer.email,
        phone1: payment.customer.telefono,
        address1: payment.customer.direccion,
        address2: payment.customer.direccion2 || '',
        city: payment.customer.ciudad,
        state: payment.customer.estado,
        postalCode: payment.customer.cp,
        country: payment.customer.pais || 'MX',
        company: payment.customer.empresa || '',
        ip: payment.metadata?.ip || '127.0.0.1',
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: payment.cardData.cvv,
      },
    };

    const { data } = await axios.post(`${API_URL}/sale`, salePayload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return {
      success: data.status === 'APPROVED',
      orderId: data.orderId,
      reference: data.reference,
      status: data.status,
      data,
    };
  } catch (error: any) {
    console.error('Keycop Payment Error:', error.response?.data || error.message);
    return {
      success: false,
      status: 'error',
      error: error.response?.data?.message || 'Error procesando el pago',
    };
  }
}