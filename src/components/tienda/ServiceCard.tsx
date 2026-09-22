'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Service } from '@/data/services';
import { formatMXN, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ServiceCardProps {
  service: Service;
  className?: string;
  featured?: boolean;
}

export default function ServiceCard({ service, className, featured }: ServiceCardProps) {
  const tShop = useTranslations('shop');
  const tCommon = useTranslations('common');
  const tAll = useTranslations();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const name = tAll(service.nameKey);
  const desc = tAll(service.descriptionKey);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(
      {
        slug: service.slug,
        nameKey: service.nameKey,
        image: service.image,
        price: service.price,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/producto/${service.slug}/`}
      className={cn(
        'group relative bg-white rounded-3xl overflow-hidden border border-neutralgray/10 transition-all duration-500',
        'hover:shadow-[0_20px_60px_-15px_rgba(245,199,177,0.5)] hover:-translate-y-2',
        featured && 'md:col-span-2 lg:col-span-3',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          featured ? 'aspect-[3/1]' : 'aspect-[4/3]'
        )}
      >
        <Image
          src={service.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-0 right-0 w-20 h-20 bg-peach/40 triangle-clip rotate-180 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />

        {/* Botón Añadir (aparece en hover) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'inline-flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300',
              added ? 'bg-sage text-ink' : 'bg-white text-ink hover:bg-peach'
            )}
          >
            {added ? (
              <>
                <i className="bi bi-check-lg" />
                {tShop('added')}
              </>
            ) : (
              <>
                {tShop('addToCart')}
                <i className="bi bi-cart-plus" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display font-bold text-lg text-ink mb-2 group-hover:text-peach-dark transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="text-ink/60 text-sm leading-relaxed line-clamp-2 mb-4">
          {desc}
        </p>
        <div className="flex items-end justify-between">
          <span className="font-display font-extrabold text-xl text-peach-dark tabular-nums">
            {formatMXN(service.price)}
          </span>
          <span className="text-xs text-ink/50 font-medium">
            {tCommon('currency')} +{tCommon('vat')}
          </span>
        </div>
      </div>
    </Link>
  );
}