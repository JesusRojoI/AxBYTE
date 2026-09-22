'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import TriangleBg from '@/components/ui/TriangleBg';

export default function ServicesIntro() {
  const t = useTranslations('home.services');

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      <TriangleBg variant="grid" />
      <TriangleBg variant="drift" count={8} />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-peach-dark">
            <span className="w-8 h-0.5 bg-peach-dark" />
            Servicios
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-ink/70 leading-relaxed mb-10 max-w-3xl">
            {t('description')}
          </p>
          <Link
            href="/tienda/"
            className="inline-flex items-center gap-2 text-peach-dark font-semibold group"
          >
            <span className="border-b-2 border-peach-dark pb-1 group-hover:border-peach transition-colors">
              {t('viewAll')}
            </span>
            <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}