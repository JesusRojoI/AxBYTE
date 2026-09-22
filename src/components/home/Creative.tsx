'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Creative() {
  const t = useTranslations('home.creative');

  const blocks = [
    { title: t('title'), desc: t('description') },
    { title: t('smart.title'), desc: t('smart.description') },
    { title: t('marketing.title'), desc: t('marketing.description') },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ============ IZQUIERDA 50% ============ */}
          <div className="space-y-10">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05] text-ink">
              <span className="relative inline-block">
                {blocks[0].title}
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-peach/40 -z-10" />
              </span>
            </h2>
            <p className="text-lg text-ink/70 leading-relaxed">
              {blocks[0].desc}
            </p>

            <div className="space-y-6 pt-6 border-t border-neutralgray/10">
              {blocks.slice(1).map((block, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="shrink-0 w-12 h-12 bg-sage/50 rounded-xl flex items-center justify-center group-hover:bg-peach group-hover:scale-110 transition-all duration-300">
                    <span className="font-display font-extrabold text-ink">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1.5">
                      {block.title}
                    </h3>
                    <p className="text-ink/65 text-sm leading-relaxed">
                      {block.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <i className="bi bi-shield-lock-fill text-peach-dark text-2xl" />
              <span className="text-ink/80 font-medium">{t('payments')}</span>
            </div>
          </div>

          {/* ============ DERECHA 50% ============ */}
          <div className="relative">
            {/* Máscara animada con triángulos */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-peach triangle-clip animate-float-slow z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-sage triangle-clip rotate-180 animate-float-medium z-10" />

            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src="/images/sections/creative.jpg"
                alt="Creative design"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Overlay con patrón de puntos */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #F5C7B1 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}