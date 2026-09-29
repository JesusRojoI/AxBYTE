'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const CATEGORIES = [
  {
    key: 'graphic' as const,
    image: '/images/services/diseno-logo.jpg',
    href: '/producto/diseno-de-logo/',
    items: ['logo', 'brochures', 'banners', 'illustrations'] as const,
  },
  {
    key: 'print' as const,
    image: '/images/services/diseno-packaging.jpg',
    href: '/producto/diseno-de-packaging/',
    items: ['packaging', 'tshirts', 'posters', 'catalogs'] as const,
  },
  {
    key: 'web' as const,
    image: '/images/services/diseno-web.jpg',
    href: '/producto/diseno-web-responsivo/',
    items: ['responsive', 'ecommerce', 'redesign', 'speed'] as const,
  },
  {
    key: 'brand' as const,
    image: '/images/services/diseno-identidad.jpg',
    href: '/producto/diseno-identidad-visual/',
    items: ['consulting', 'naming', 'identity'] as const,
  },
  {
    key: 'marketing' as const,
    image: '/images/services/gestion-redes.jpg',
    href: '/producto/gestion-de-redes-sociales/',
    items: ['social', 'ads', 'content', 'seo', 'email'] as const,
  },
  {
  key: 'multimedia' as const,
  image: '/images/services/multimedia.jpg',  // 👈 nueva imagen
  href: '/producto/fotografia-de-producto/',
  items: ['photo', 'video'] as const,
},
];

export default function ServicesGrid() {
  const t = useTranslations('home.featuredServices');
  const tHome = useTranslations('home');
  const tOtros = useTranslations('home.otros');

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
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative bg-white rounded-3xl overflow-hidden border border-neutralgray/10 hover:shadow-[0_20px_60px_-15px_rgba(245,199,177,0.5)] hover:-translate-y-2 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={t(`${cat.key}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-display font-extrabold text-white text-2xl leading-tight">
                    {t(`${cat.key}.title`)}
                  </h3>
                </div>
                <div className="absolute top-3 right-3 w-12 h-12 bg-peach/60 triangle-clip rotate-180 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <ul className="space-y-2.5 flex-1">
                  {cat.items.map((k) => (
                    <li key={k} className="text-sm">
                      <span className="font-semibold text-ink">
                        {t(`${cat.key}.items.${k}.name`)}:
                      </span>{' '}
                      <span className="text-ink/65">
                        {t(`${cat.key}.items.${k}.desc`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="inline-flex items-center justify-center w-full gap-2 px-5 py-2.5 bg-peach text-ink text-sm font-bold rounded-xl group-hover:bg-ink group-hover:text-white transition-colors">
                    {tHome('hire')}
                    <i className="bi bi-arrow-right" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Otros Servicios */}
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
                  <li key={item} className="flex items-start gap-2 text-ink/75 text-sm">
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