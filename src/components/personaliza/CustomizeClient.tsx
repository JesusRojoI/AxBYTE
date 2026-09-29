'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useFormToken } from '@/lib/form-token';

export default function CustomizeClient() {
  const t = useTranslations('customize');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isEn = locale === 'en';
  const { addItem } = useCart();
  const formToken = useFormToken();

  const [email, setEmail] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [amount, setAmount] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    variant: 'success' | 'error';
    title: string;
    msg: string;
  }>({ open: false, variant: 'success', title: '', msg: '' });
  const [hideForm, setHideForm] = useState(false);

  const validate = (): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return isEn ? 'Invalid email' : 'Email inválido';
    if (!quoteId.trim())
      return isEn ? 'Quote ID is required' : 'ID de cotización requerido';
    const n = parseFloat(amount);
    if (isNaN(n) || n <= 0)
      return isEn ? 'Invalid amount' : 'Monto inválido';
    if (!/^\d+(\.\d{1,2})?$/.test(amount))
      return isEn
        ? 'Amount must have at most 2 decimals'
        : 'Monto debe tener máximo 2 decimales';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setModal({
        open: true,
        variant: 'error',
        title: isEn ? 'Error sending' : 'Error al enviar',
        msg: err,
      });
      return;
    }

    setSending(true);
    const subtotal = parseFloat(amount);

    try {
      await fetch('/api/send-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          type: 'quote',
          language: locale,
          name: quoteId,
          email,
          quoteId,
          amount: subtotal,
          _token: formToken,
          _website: honeypot,
        }),
      });

      addItem(
        {
          slug: `custom-${quoteId}`,
          nameKey: 'customize.title',
          image: '/images/sections/customize.jpg',
          price: subtotal,
          custom: true,
          quoteId,
        },
        1
      );

      setModal({
        open: true,
        variant: 'success',
        title: t('successTitle'),
        msg: t('successMsg'),
      });
      setHideForm(true);
    } catch (e: any) {
      setModal({
        open: true,
        variant: 'error',
        title: isEn ? 'Error sending' : 'Error al enviar',
        msg:
          e.message ||
          (isEn
            ? 'Your quote could not be processed. Please try again.'
            : 'No se pudo procesar tu cotización. Intenta nuevamente.'),
      });
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-white border border-neutralgray/20 rounded-xl text-ink placeholder:text-ink/30 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all';

  return (
    <>
      {/* ============ SECCIÓN 1 — HERO ============ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <Image
          src="/images/sections/customize.jpg"
          alt="Customize"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/75" />

        <div className="absolute top-16 right-[10%] w-32 h-32 bg-peach/40 triangle-clip animate-float-slow" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-peach">
              <span className="w-8 h-0.5 bg-peach" />
              {t('tag')}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 2 — FORMULARIO ============ */}
      <section className="relative py-20 md:py-24 bg-[#FAFAF8] overflow-hidden">
        <div className="absolute top-20 left-[5%] w-20 h-20 bg-peach/30 triangle-clip animate-float-slow" />
        <div className="absolute bottom-20 right-[8%] w-24 h-24 bg-sage/40 triangle-clip rotate-180 animate-float-medium" />

        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Formulario 60% */}
            <div className="lg:col-span-3">
              {!hideForm ? (
                <div className="bg-white rounded-3xl border border-neutralgray/10 p-8 md:p-10 relative">
                  {/* Honeypot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      overflow: 'hidden',
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="website-hp-custom">Website</label>
                    <input
                      type="text"
                      id="website-hp-custom"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        {t('email')} <span className="text-peach-dark">*</span>
                      </label>
                      <input
                        type="email"
                        className={inputCls}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        {t('quoteId')} <span className="text-peach-dark">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputCls}
                        value={quoteId}
                        onChange={(e) => setQuoteId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        {t('amount')} <span className="text-peach-dark">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        className={inputCls}
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) =>
                          setAmount(e.target.value.replace(/[^0-9.]/g, ''))
                        }
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={sending}
                      icon={sending ? 'bi-arrow-repeat' : 'bi-send'}
                    >
                      {sending ? tCommon('loading') : t('submit')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-sage/20 rounded-3xl border border-sage-dark/20 p-10 text-center">
                  <div className="inline-flex w-20 h-20 bg-sage rounded-full items-center justify-center mb-5">
                    <i className="bi bi-check-lg text-4xl text-ink" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-ink mb-3">
                    {t('successTitle')}
                  </h3>
                  <p className="text-ink/70 mb-6">{t('successMsg')}</p>
                  <Button href="/carrito/" variant="primary" icon="bi-cart">
                    {t('goToCart')}
                  </Button>
                </div>
              )}
            </div>

            {/* Imagen 40% */}
            <div className="lg:col-span-2 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-peach triangle-clip rotate-180 animate-float-slow z-10" />
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="/images/sections/customize.jpg"
                  alt="Customize"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sage triangle-clip animate-float-fast z-10" />
            </div>
          </div>
        </div>
      </section>

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