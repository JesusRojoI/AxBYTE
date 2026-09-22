'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Service } from '@/data/services';
import { formatMXN } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import QuantitySelector from '@/components/ui/QuantitySelector';

interface ProductDetailProps {
  service: Service;
}

export default function ProductDetail({ service }: ProductDetailProps) {
  const t = useTranslations();
  const tProduct = useTranslations('product');
  const tCommon = useTranslations('common');
  const tShop = useTranslations('shop');
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const name = t(service.nameKey);
  const desc = t(service.descriptionKey);

  const handleAddToCart = () => {
    console.log('[ProductDetail] Añadiendo al carrito:', {
      slug: service.slug,
      qty,
      price: service.price,
    });

    addItem(
      {
        slug: service.slug,
        nameKey: service.nameKey,
        image: service.image,
        price: service.price,
      },
      qty
    );

    setAdded(true);
    setTimeout(() => {
      router.push('/carrito/');
    }, 400);
  };
const hasIncludes = service.includes && service.includes.length > 0;
  const hasFeatures = service.features && service.features.length > 0;

  return (
    <section className="relative bg-[#FAFAF8] overflow-hidden">
      <div className="absolute top-20 right-[10%] w-24 h-24 bg-peach/20 triangle-clip animate-float-slow" />
      <div className="absolute bottom-20 left-[8%] w-32 h-32 bg-sage/30 triangle-clip rotate-180 animate-float-medium" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ============ COLUMNA IZQUIERDA — INFO ============ */}
          <div className="order-2 lg:order-1">
            {/* Breadcrumb */}
            <nav className="text-xs text-ink/50 mb-6 flex items-center gap-2 flex-wrap">
              <a href="/" className="hover:text-peach-dark transition-colors">
                {t('header.home')}
              </a>
              <i className="bi bi-chevron-right text-[10px]" />
              <a href="/tienda/" className="hover:text-peach-dark transition-colors">
                {t('header.services')}
              </a>
              <i className="bi bi-chevron-right text-[10px]" />
              <span className="text-peach-dark font-semibold truncate max-w-[200px]">
                {name}
              </span>
            </nav>

            <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-[1.1] text-ink mb-5">
              {name}
            </h1>

            <p className="text-lg text-ink/70 leading-relaxed mb-8">
              {desc}
            </p>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-neutralgray/10">
              <span className="font-display font-extrabold text-4xl md:text-5xl text-peach-dark tabular-nums">
                {formatMXN(service.price)}
              </span>
              <span className="text-sm text-ink/50 font-medium">
                {tCommon('currency')} +{tCommon('vat')}
              </span>
            </div>

            {/* Cantidad + Añadir al carrito */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div>
                <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2">
                  {tProduct('quantity')}
                </label>
                <QuantitySelector value={qty} onChange={setQty} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-ink/60 uppercase tracking-wider mb-2 opacity-0">
                  &nbsp;
                </label>
                <Button
                  onClick={handleAddToCart}
                  variant={added ? 'sage' : 'primary'}
                  size="lg"
                  fullWidth
                  icon={added ? 'bi-check-lg' : 'bi-cart-plus'}
                >
                  {added ? tShop('added') : tProduct('addToCart')}
                </Button>
              </div>
            </div>

            {/* Includes / Features */}
            {(hasIncludes || hasFeatures) && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-neutralgray/10">
                <h3 className="font-display font-extrabold text-xl text-ink mb-5 flex items-center gap-3">
                  <span className="w-2 h-2 bg-peach rounded-full" />
                  {hasIncludes ? tShop('includes') : tShop('features')}
                </h3>
                <ul className="space-y-3">
                  {(hasIncludes ? service.includes : service.features)!.map(
                    (key, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-ink/75 text-sm leading-relaxed"
                      >
                        <i className="bi bi-check2-circle text-peach-dark mt-0.5 shrink-0 text-base" />
                        <span>{t(key)}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* ============ COLUMNA DERECHA — IMAGEN ============ */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="relative rounded-[2rem] overflow-hidden aspect-square shadow-2xl">
              <Image
                src={service.image}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            <div className="absolute -top-4 -left-4 w-20 h-20 bg-peach triangle-clip animate-float-fast" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sage triangle-clip rotate-180 animate-float-slow" />
          </div>
        </div>
      </div>
    </section>
  );
}