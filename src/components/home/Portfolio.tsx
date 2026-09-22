'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const portfolios = [
  { title: 'Digital Rebrand', tag: 'Branding, Website', image: '/images/sections/portfolio-1.jpg', span: 'lg:col-span-2 lg:row-span-2' },
  { title: 'Curved', tag: 'Mobile App, Design', image: '/images/sections/portfolio-2.jpg', span: '' },
  { title: 'Magazine', tag: 'Design, Print', image: '/images/sections/portfolio-3.jpg', span: '' },
  { title: 'Wallet', tag: 'Mobile App, UX', image: '/images/sections/portfolio-4.jpg', span: '' },
  { title: 'Hardway', tag: 'Graphic Design', image: '/images/sections/portfolio-5.jpg', span: '' },
];

export default function Portfolio() {
  const t = useTranslations('home.portfolio');

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 md:py-32 bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-ink">
              {t('title')}
            </h2>
          </div>
          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 text-peach-dark font-semibold group"
          >
            <i className="bi bi-briefcase text-lg" />
            <span className="border-b-2 border-peach-dark group-hover:border-peach transition-colors">
              {t('link')}
            </span>
            <i className="bi bi-arrow-right transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Grid 3x2 con uno doble */}
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-6 lg:auto-rows-[280px]">
          {portfolios.map((p, i) => (
            <button
              key={p.title}
              onClick={scrollTop}
              className={`group relative rounded-3xl overflow-hidden text-left ${p.span} min-h-[280px] hover:shadow-2xl transition-all duration-500`}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />

              {/* Triángulo decorativo */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-peach/60 triangle-clip opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-peach mb-2">
                  {p.tag}
                </span>
                <h3 className="font-display font-extrabold text-white text-2xl md:text-3xl">
                  {p.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}