'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import TriangleBg from '@/components/ui/TriangleBg';
import { formatPrice } from '@/lib/utils';

interface LastOrder {
  items: Array<{
    id: string;
    slug: string;
    nameKey: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
  transactionId: string;
  customerName: string;
  email: string;
}

export default function SuccessClient() {
  const t = useTranslations('success');
  const tCommon = useTranslations('common');
  const tAll = useTranslations();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('axbyte_last_order');
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-peach border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-20 bg-[#FAFAF8] overflow-hidden">
      <TriangleBg variant="drift" count={12} />

      <div className="relative max-w-[900px] mx-auto px-6">
        {/* Header con check */}
        <div className="text-center mb-12">
          <div className="inline-flex w-24 h-24 bg-sage rounded-full items-center justify-center mb-6 animate-[slideUp_.6s_ease-out]">
            <i className="bi bi-check-lg text-5xl text-ink" />
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-ink/70">{t('subtitle')}</p>
          <p className="text-sm text-ink/50 mt-2">{t('emailSent')}</p>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-3xl border border-neutralgray/10 overflow-hidden shadow-soft">
          <div className="px-8 py-6 bg-peach/15 border-b border-neutralgray/10 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-ink">
              {t('orderSummary')}
            </h2>
            <span className="text-xs font-mono text-ink/60 bg-white px-3 py-1 rounded-full">
              #{order.transactionId}
            </span>
          </div>

          <ul className="divide-y divide-neutralgray/10">
            {order.items.map((item) => (
              <li key={item.id} className="px-8 py-4 flex justify-between gap-4">
                <span className="text-ink/80 text-sm">
                  {tAll(item.nameKey)}{' '}
                  <span className="text-ink/40">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-ink tabular-nums text-sm">
                  MXN${formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="px-8 py-6 bg-[#FAFAF8] space-y-2">
            <div className="flex justify-between text-sm text-ink/70">
              <span>{tCommon('subtotal')}</span>
              <span className="tabular-nums">MXN${formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink/70">
              <span>{tCommon('vat')} (16%)</span>
              <span className="tabular-nums">MXN${formatPrice(order.vat)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-neutralgray/10">
              <span className="font-display font-extrabold text-lg text-ink">
                {tCommon('total')}
              </span>
              <span className="font-display font-extrabold text-2xl text-peach-dark tabular-nums">
                MXN${formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button href="/tienda/" variant="primary" size="lg" icon="bi-grid">
            {t('continueShopping')}
          </Button>
        </div>
      </div>
    </section>
  );
}