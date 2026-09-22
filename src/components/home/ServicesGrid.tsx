'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { services } from '@/data/services';

const HOME_FEATURED_SLUGS = [
  'diseno-de-logo',
  'diseno-web-responsivo',
  'gestion-de-redes-sociales',
  'diseno-de-packaging',
  'diseno-identidad-visual',
  'edicion-de-video',
];

export default function ServicesGrid() {
  const t = useTranslations();
  const tHome = useTranslations('home');
  const tOtros = useTranslations('home.otros');

  const featured = services.filter((s) => HOME_FEATURED_SLUGS.includes(s.slug));

  const otrosItems = [
    tOtros('items.asesoria'),
    tOtros('items.packagingSost'),
    tOtros('items.traduccion'),
    tOtros('items.apps'),
    tOtros('items.ux'),
  ];

  return (
    <section className="relative py-20 md:py-28 bg-[#FAFAF8] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service, i) => (
            <Link
              key={service.slug}
              href={`/producto/${service.slug}/`}
              className="group relative bg-white rounded-3xl overflow-hidden border border-neutralgray/10 hover:shadow-[0_20px_60px_-15px_rgba(245,199,177,0.5)] hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={t(service.nameKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

                <div className="absolute top-5 left-5 right-5">
                  <h3 className="font-display font-extrabold text-white text-xl leading-tight uppercase tracking-wide">
                    {t(service.nameKey)}
                  </h3>
                </div>

                <div className="absolute bottom-5 left-5 right-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="inline-flex items-center justify-center w-full gap-2 px-5 py-3 bg-peach text-ink text-sm font-bold rounded-xl group-hover:bg-white transition-colors">
                    {tHome('hire')}
                    <i className="bi bi-arrow-right" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-ink/70 text-sm leading-relaxed line-clamp-3">
                  {t(service.descriptionKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* ============ Otros Servicios — Fila 3 ============ */}
        <div className="mt-6 group relative bg-gradient-to-br from-peach-light via-white to-sage-light rounded-3xl overflow-hidden border border-neutralgray/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-peach triangle-clip rotate-180 translate-x-8 -translate-y-8 opacity-30" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-sage triangle-clip translate-x-4 translate-y-4 opacity-40" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-4">
                {tOtros('title')}
              </h3>
              <ul className="space-y-2 mb-6">
                {otrosItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-ink/75 text-sm"
                  >
                    <i className="bi bi-check2-circle text-peach-dark mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/tienda/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-peach-dark hover:gap-3 transition-all duration-300"
              >
                {tHome('hire')}
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/sections/creative.jpg"
                alt={tOtros('title')}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}