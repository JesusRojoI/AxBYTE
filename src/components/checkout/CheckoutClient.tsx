'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { countries } from '@/data/countries';
import { mexicanStates } from '@/data/states';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface FormState {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  orderNotes: string;
  cardName: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  acceptTerms: boolean;
}

export default function CheckoutClient() {
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');
  const tAll = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal, vat, total, clearCart, isHydrated } = useCart();

  // 🌟 FLAG: evita que el redirect a /carrito/ se dispare tras clearCart()
  const [completed, setCompleted] = useState(false);

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    company: '',
    country: 'MX',
    address: '',
    address2: '',
    city: '',
    state: 'Estado de México',
    postalCode: '',
    phone: '',
    email: '',
    orderNotes: '',
    cardName: '',
    cardNumber: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    acceptTerms: false,
  });

  const [processing, setProcessing] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    variant: 'success' | 'error';
    title: string;
    msg: string;
  }>({ open: false, variant: 'error', title: '', msg: '' });

  // 🌟 No redirigir si ya se completó la compra
  if (!completed && isHydrated && items.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/carrito/');
    }
    return null;
  }

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-peach border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const isEn = locale === 'en';

  const validate = (): string | null => {
    if (!form.firstName.trim()) return isEn ? 'First name is required' : 'Nombre requerido';
    if (!form.lastName.trim()) return isEn ? 'Last name is required' : 'Apellidos requeridos';
    if (!form.address.trim()) return isEn ? 'Address is required' : 'Dirección requerida';
    if (!form.city.trim()) return isEn ? 'City is required' : 'Ciudad requerida';
    if (!/^\d{5}$/.test(form.postalCode))
      return isEn ? 'Invalid postal code (5 digits)' : 'Código postal inválido (5 dígitos)';
    if (!/^\d{10}$/.test(form.phone))
      return isEn ? 'Invalid phone (10 digits)' : 'Teléfono inválido (10 dígitos)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return isEn ? 'Invalid email' : 'Correo inválido';
    if (!form.cardName.trim() || form.cardName.length < 3)
      return isEn ? 'Invalid cardholder name' : 'Nombre en tarjeta inválido';
    if (form.cardNumber.replace(/\s/g, '').length !== 16)
      return isEn ? 'Invalid card number' : 'Número de tarjeta inválido';
    if (!/^\d{2}$/.test(form.cardMonth) || Number(form.cardMonth) > 12)
      return isEn ? 'Invalid month' : 'Mes inválido';
    if (!/^\d{2}$/.test(form.cardYear))
      return isEn ? 'Invalid year' : 'Año inválido';
    if (!/^\d{3,4}$/.test(form.cardCvv))
      return isEn ? 'Invalid CVC' : 'CVC inválido';
    if (!form.acceptTerms)
      return isEn ? 'You must accept the terms' : 'Debes aceptar los términos';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setModal({
        open: true,
        variant: 'error',
        title: isEn ? 'Incomplete data' : 'Datos incompletos',
        msg: err,
      });
      return;
    }

    setProcessing(true);

    try {
      const orderId = `AXB-${Date.now()}`;

      // ==================== PASO 1: PAGO ====================
      const paymentRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId,
          language: locale,
          cardData: {
            number: form.cardNumber,
            name: form.cardName,
            month: form.cardMonth,
            year: form.cardYear,
            cvv: form.cardCvv,
          },
          customer: {
            nombre: form.firstName,
            apellido: form.lastName,
            email: form.email,
            telefono: form.phone,
            direccion: form.address,
            direccion2: form.address2,
            ciudad: form.city,
            estado: form.state,
            pais: form.country,
            cp: form.postalCode,
            empresa: form.company,
          },
        }),
      });

      const payment = await paymentRes.json();
      console.log('[Checkout] Payment response:', payment);

      if (!payment.success) {
        setModal({
          open: true,
          variant: 'error',
          title: isEn ? 'Payment declined' : 'Pago rechazado',
          msg:
            payment.error ||
            (isEn
              ? 'Could not process the payment. Please verify your card details.'
              : 'No se pudo procesar el pago. Verifica los datos de tu tarjeta.'),
        });
        setProcessing(false);
        return;
      }

      const transactionId = payment.orderId || payment.reference || orderId;

      // ==================== PASO 2: GUARDAR ORDEN ANTES DE LIMPIAR ====================
      // 🌟 CRÍTICO: guardar en sessionStorage ANTES de clearCart()
      const orderSnapshot = {
        items: items.map((i) => ({
          ...i,
          displayName: i.custom ? tAll('customize.title') : tAll(i.nameKey),
        })),
        subtotal,
        vat,
        total,
        transactionId,
        customerName: `${form.firstName} ${form.lastName}`,
        email: form.email,
      };

      sessionStorage.setItem('axbyte_last_order', JSON.stringify(orderSnapshot));
      console.log('[Checkout] Order saved to sessionStorage:', orderSnapshot);

      // ==================== PASO 3: MARCAR COMO COMPLETADO ====================
      // 🌟 CRÍTICO: evitar que el redirect a /carrito/ se dispare
      setCompleted(true);

      // ==================== PASO 4: ENVIAR CORREOS (fire & forget) ====================
      // No bloqueante: enviamos y no esperamos a que termine antes de redirigir
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.email,
          type: 'purchase',
          language: locale,
          orderData: {
            nombre: `${form.firstName} ${form.lastName}`,
            apellido: form.lastName,
            email: form.email,
            telefono: form.phone,
            productos: items.map((i) => ({
              nombre: i.custom ? tAll('customize.title') : tAll(i.nameKey),
              cantidad: i.quantity,
              precio: i.price,
            })),
            subtotal,
            descuento: 0,
            impuesto: vat,
            total,
            transactionId,
          },
        }),
      }).catch((e) => console.error('[Checkout] Email error (non-blocking):', e));

      // ==================== PASO 5: LIMPIAR CARRITO ====================
      clearCart();

      // ==================== PASO 6: REDIRIGIR ====================
      console.log('[Checkout] Redirecting to /compra-exitosa/');
      router.push('/compra-exitosa/');
    } catch (e: any) {
      console.error(e);
      setModal({
        open: true,
        variant: 'error',
        title: isEn ? 'Error' : 'Error',
        msg:
          e.message ||
          (isEn ? 'An unexpected error occurred.' : 'Ocurrió un error inesperado.'),
      });
      setProcessing(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-white border border-neutralgray/20 rounded-xl text-ink placeholder:text-ink/30 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all';

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mb-10">
          {t('title')}
        </h1>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Facturación */}
            <section className="bg-white rounded-3xl border border-neutralgray/10 p-6 md:p-8">
              <h2 className="font-display font-extrabold text-2xl text-ink mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-peach rounded-full" />
                {t('billing')}
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('firstName')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('lastName')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('company')}{' '}
                    <span className="text-ink/40 text-xs">({tCommon('optional')})</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('country')} <span className="text-peach-dark">*</span>
                  </label>
                  <select
                    className={inputCls}
                    value={form.country}
                    onChange={(e) => set('country', e.target.value)}
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {locale === 'en' ? c.name_en : c.name_es}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('address')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder={t('addressPlaceholder')}
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('address2')}{' '}
                    <span className="text-ink/40 text-xs">({tCommon('optional')})</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.address2}
                    onChange={(e) => set('address2', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('city')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('state')} <span className="text-peach-dark">*</span>
                  </label>
                  <select
                    className={inputCls}
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                  >
                    {mexicanStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('postalCode')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    className={inputCls}
                    value={form.postalCode}
                    onChange={(e) =>
                      set('postalCode', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('phone')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={inputCls}
                    value={form.phone}
                    onChange={(e) =>
                      set('phone', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('email')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="email"
                    className={inputCls}
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Info adicional */}
            <section className="bg-white rounded-3xl border border-neutralgray/10 p-6 md:p-8">
              <h2 className="font-display font-extrabold text-xl text-ink mb-5">
                {t('additional')}
              </h2>
              <label className="block text-sm font-semibold text-ink mb-2">
                {t('orderNotes')}{' '}
                <span className="text-ink/40 text-xs">({tCommon('optional')})</span>
              </label>
              <textarea
                rows={4}
                className={inputCls + ' resize-none'}
                placeholder={t('orderNotesPlaceholder')}
                value={form.orderNotes}
                onChange={(e) => set('orderNotes', e.target.value)}
              />
            </section>

            {/* Tarjeta */}
            <section className="bg-white rounded-3xl border border-neutralgray/10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-extrabold text-2xl text-ink flex items-center gap-3">
                  <span className="w-2 h-2 bg-peach rounded-full" />
                  {t('creditCard')}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-6 bg-white border border-neutralgray/15 rounded px-1 py-0.5">
                    <Image src="/visa.svg" alt="Visa" fill className="object-contain p-1" />
                  </div>
                  <div className="relative w-10 h-6 bg-white border border-neutralgray/15 rounded px-1 py-0.5">
                    <Image
                      src="/mastercard.svg"
                      alt="MasterCard"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="relative w-10 h-6 bg-white border border-neutralgray/15 rounded px-1 py-0.5">
                    <Image src="/amex.svg" alt="Amex" fill className="object-contain p-1" />
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-ink mb-4">{t('cardData')}</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('cardName')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder={t('cardNamePlaceholder')}
                    value={form.cardName}
                    onChange={(e) => set('cardName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('cardNumber')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={inputCls}
                    placeholder="1234 1234 1234 1234"
                    value={form.cardNumber}
                    onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                      MM <span className="text-peach-dark">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="MM"
                      className={inputCls}
                      value={form.cardMonth}
                      onChange={(e) =>
                        set('cardMonth', e.target.value.replace(/\D/g, ''))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                      AA <span className="text-peach-dark">*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="AA"
                      className={inputCls}
                      value={form.cardYear}
                      onChange={(e) =>
                        set('cardYear', e.target.value.replace(/\D/g, ''))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                      CVC <span className="text-peach-dark">*</span>
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="CVC"
                      className={inputCls}
                      value={form.cardCvv}
                      onChange={(e) =>
                        set('cardCvv', e.target.value.replace(/\D/g, ''))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 p-4 bg-sage/30 rounded-xl">
                <i className="bi bi-shield-lock-fill text-sage-dark text-xl" />
                <span className="text-sm font-semibold text-ink">{t('secure')}</span>
              </div>
            </section>

            {/* Términos */}
            <section className="bg-white rounded-3xl border border-neutralgray/10 p-6 md:p-8">
              <p className="text-sm text-ink/60 mb-4">
                {t('privacyText')}{' '}
                <a href="/aviso-de-privacidad/" className="text-peach-dark underline">
                  {t('privacyLink')}
                </a>
                .
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => set('acceptTerms', e.target.checked)}
                  className="mt-1 w-5 h-5 accent-peach-dark cursor-pointer"
                />
                <span className="text-sm text-ink/80">
                  {t('termsText')}{' '}
                  <a href="/terminos-y-condiciones/" className="text-peach-dark underline">
                    {t('termsLink')}
                  </a>
                  {' *'}
                </span>
              </label>
            </section>
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-neutralgray/10 p-6 md:p-8">
              <h2 className="font-display font-extrabold text-2xl text-ink mb-6">
                {t('yourOrder')}
              </h2>

              <ul className="space-y-4 mb-6 pb-6 border-b border-neutralgray/10">
                {items.map((item) => {
                  const displayName = item.custom
                    ? tAll('customize.title')
                    : tAll(item.nameKey);

                  return (
                    <li key={item.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-ink/80">
                        {displayName}{' '}
                        <span className="text-ink/40">× {item.quantity}</span>
                        {item.custom && item.quoteId && (
                          <span className="block text-ink/50 text-xs mt-0.5">
                            ID: {item.quoteId}
                          </span>
                        )}
                      </span>
                      <span className="text-ink font-semibold tabular-nums shrink-0">
                        MXN${formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <dl className="space-y-3 mb-8">
                <div className="flex justify-between text-ink/70 text-sm">
                  <dt>{tCommon('subtotal')}</dt>
                  <dd className="tabular-nums">MXN${formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink/70 text-sm">
                  <dt>{tCommon('vat')} (16%)</dt>
                  <dd className="tabular-nums">MXN${formatPrice(vat)}</dd>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-neutralgray/10">
                  <dt className="font-display font-extrabold text-lg text-ink">
                    {tCommon('total')}
                  </dt>
                  <dd className="font-display font-extrabold text-2xl text-peach-dark tabular-nums">
                    MXN${formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-sage/20 rounded-xl">
                <div className="relative w-12 h-8">
                  <Image src="/keycop.png" alt="Keycop" fill className="object-contain" />
                </div>
                <div className="relative w-8 h-8">
                  <Image src="/secure.svg" alt="Secure" fill className="object-contain" />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                fullWidth
                disabled={processing}
                icon={processing ? 'bi-arrow-repeat' : 'bi-lock-fill'}
              >
                {processing ? t('processing') : t('placeOrder')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        variant={modal.variant}
      >
        {modal.msg}
      </Modal>
    </>
  );
}