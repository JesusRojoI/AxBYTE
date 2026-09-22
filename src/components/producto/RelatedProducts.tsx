'use client';

import { useTranslations } from 'next-intl';
import { getServiceBySlug } from '@/data/services';
import ServiceCard from '@/components/tienda/ServiceCard';

interface RelatedProductsProps {
  slugs: string[];
}

export default function RelatedProducts({ slugs }: RelatedProductsProps) {
  const t = useTranslations('product');
  const related = slugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  if (related.length === 0) return null;

  return (
    <section className="relative py-20 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink">
            {t('relatedProducts')}
          </h2>
          <div className="hidden md:block w-24 h-1 bg-peach rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}