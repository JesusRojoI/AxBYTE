'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import Toast from '@/components/ui/Toast';

export default function CartClient() {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const tAll = useTranslations();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    vat,
    total,
    undoRemove,
    isHydrated,
  } = useCart();

  const [toastOpen, setToastOpen] = useState(false);
  const [removedName, setRemovedName] = useState('');

  if (!isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-peach border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-flex w-24 h-24 bg-peach/20 rounded-3xl items-center justify-center mb-6">
            <i className="bi bi-cart-x text-4xl text-peach-dark" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-ink mb-4">
            {t('empty')}
          </h2>
          <p className="text-ink/60 mb-8">{t('emptyDesc')}</p>
          <Button href="/tienda/" variant="primary" size="lg" icon="bi-grid">
            {t('emptyBtn')}
          </Button>
        </div>
      </div>
    );
  }

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    setRemovedName(name);
    setToastOpen(true);
  };

  const handleUndo = () => {
    undoRemove();
    setToastOpen(false);
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink mb-10">
          {t('title')}
        </h1>

        <div className="bg-white rounded-3xl border border-neutralgray/10 overflow-hidden">
          {/* Encabezados */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-peach/15 border-b border-neutralgray/10 text-xs font-semibold uppercase tracking-wider text-ink/60">
            <div className="col-span-1" />
            <div className="col-span-5">{t('product')}</div>
            <div className="col-span-2 text-center">{t('price')}</div>
            <div className="col-span-2 text-center">{t('quantity')}</div>
            <div className="col-span-2 text-right">{t('subtotal')}</div>
          </div>

          {/* Items */}
          <ul className="divide-y divide-neutralgray/10">
            {items.map((item) => {
              const displayName = item.custom
                ? tAll('customize.title')
                : tAll(item.nameKey);

              return (
                <li
                  key={item.id}
                  className="grid md:grid-cols-12 gap-4 items-center px-6 py-5 hover:bg-peach/5 transition-colors"
                >
                  {/* Eliminar */}
                  <div className="md:col-span-1 flex md:justify-start justify-end">
                    <button
                      onClick={() => handleRemove(item.id, displayName)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-ink/40 hover:text-peach-dark hover:bg-peach/15 transition-colors"
                      aria-label={t('remove')}
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>

                  {/* Producto: imagen + nombre */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-peach/10">
                      <Image
                        src={item.image}
                        alt={displayName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      {item.custom ? (
                        <span className="font-semibold text-ink">
                          {displayName}
                          {item.quoteId && (
                            <span className="text-ink/50 text-xs ml-2">
                              ID: {item.quoteId}
                            </span>
                          )}
                        </span>
                      ) : (
                        <Link
                          href={`/producto/${item.slug}/`}
                          className="font-semibold text-ink hover:text-peach-dark transition-colors line-clamp-2"
                        >
                          {displayName}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Precio unitario */}
                  <div className="md:col-span-2 md:text-center text-sm text-ink/70 tabular-nums">
                    MXN${formatPrice(item.price)}
                  </div>

                  {/* 🌟 CANTIDAD — ahora funciona para TODOS, incluidos los custom */}
                  <div className="md:col-span-2 flex md:justify-center">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, q)}
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="md:col-span-2 md:text-right font-display font-extrabold text-peach-dark tabular-nums">
                    MXN${formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Totales */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div />

          <div className="bg-white rounded-3xl border border-neutralgray/10 p-8">
            <h2 className="font-display font-extrabold text-2xl text-ink mb-6">
              {t('total')}
            </h2>
            <dl className="space-y-3 mb-8">
              <div className="flex justify-between text-ink/70">
                <dt>{tCommon('subtotal')}</dt>
                <dd className="tabular-nums">MXN${formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink/70">
                <dt>
                  {tCommon('vat')} (16%)
                </dt>
                <dd className="tabular-nums">MXN${formatPrice(vat)}</dd>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-neutralgray/10">
                <dt className="font-display font-extrabold text-xl text-ink">
                  {tCommon('total')}
                </dt>
                <dd className="font-display font-extrabold text-2xl text-peach-dark tabular-nums">
                  MXN${formatPrice(total)}
                </dd>
              </div>
            </dl>

            <Button
              href="/finalizar-compra/"
              variant="primary"
              size="lg"
              fullWidth
              icon="bi-arrow-right"
              iconRight
            >
              {t('checkout')}
            </Button>
          </div>
        </div>
      </div>

      <Toast
        open={toastOpen}
        message={`"${removedName}" ${t('removed')}.`}
        undoLabel={tCommon('undo')}
        onUndo={handleUndo}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}