'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function CTASection() {
  const t = useTranslations('home.cta');

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <Image
        src="/images/sections/cta-bg.jpg"
        alt="CTA Background"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/80" />

      {/* Triángulos decorativos */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-peach/30 triangle-clip animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-sage/30 triangle-clip rotate-180 animate-float-medium" />

      <div className="relative max-w-[1400px] mx-auto px-6 text-center">
        <h2 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] text-white mb-6 animate-[slideUp_.8s_ease-out]">
          {t('title')}
        </h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12 max-w-3xl mx-auto animate-[slideUp_.8s_ease-out_.1s_both]">
          {t('description')}
        </p>
        <div className="animate-[slideUp_.8s_ease-out_.2s_both]">
          <Button href="/contacto/" variant="peach" size="lg" icon="bi-arrow-right" iconRight>
            {t('button')}
          </Button>
        </div>
      </div>
    </section>
  );
}