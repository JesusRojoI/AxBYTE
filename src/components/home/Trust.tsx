'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function Trust() {
  const t = useTranslations('home.trust');

  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* ============ IZQUIERDA 40% ============ */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage triangle-clip rotate-180 animate-float-slow z-10" />
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl">
              <Image
                src="/images/sections/trust.jpg"
                alt="Trust"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-peach triangle-clip animate-float-fast z-10" />
          </div>

          {/* ============ DERECHA 60% ============ */}
          <div className="lg:col-span-3">
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05] text-ink mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-2xl">
              {t('description')}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-peach-dark mb-8">
              {t('subtitle')}
            </p>
            <Button href="/contacto/" variant="primary" size="lg" icon="bi-arrow-right" iconRight>
              {t('button')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}