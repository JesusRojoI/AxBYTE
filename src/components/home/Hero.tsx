'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-[#FAFAF8]">
      {/* Triángulos decorativos de fondo */}
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-peach/30 triangle-clip animate-float-slow" />
      <div className="absolute bottom-32 right-[15%] w-40 h-40 bg-sage/40 triangle-clip rotate-180 animate-float-medium" />
      <div className="absolute top-1/3 right-[5%] w-16 h-16 bg-neutralgray/10 triangle-clip animate-float-fast" />

      <div className="relative max-w-[1400px] mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* ============ COLUMNA IZQUIERDA 40% ============ */}
          <div className="lg:col-span-2">
            <h1 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.02] mb-6 text-ink animate-[slideUp_.8s_ease-out]">
              AxBYTE{' '}
              <span className="gradient-text">Creative Solutions</span>
            </h1>
            <p className="text-lg text-ink/70 leading-relaxed mb-10 max-w-xl animate-[slideUp_.8s_ease-out_.1s_both]">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-4 animate-[slideUp_.8s_ease-out_.2s_both]">
              <Button href="/contacto/" variant="primary" size="lg" icon="bi-arrow-right" iconRight>
                {t('contactBtn')}
              </Button>
              <Button href="/tienda/" variant="secondary" size="lg" icon="bi-grid">
                {t('servicesBtn')}
              </Button>
            </div>
          </div>

          {/* ============ COLUMNA DERECHA 60% ============ */}
          <div className="lg:col-span-3 relative h-[500px] md:h-[600px]">
            {/* Figura geométrica detrás */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90%] h-[90%] bg-gradient-to-br from-peach-light via-white to-sage-light rounded-[3rem] rotate-3 animate-float-slow" />
            </div>

            {/* Imagen 1 (principal) */}
            <div className="absolute top-[5%] left-[5%] w-[65%] h-[70%] rounded-3xl overflow-hidden shadow-2xl animate-float-slow">
              <Image
                src="/images/sections/hero-1.jpg"
                alt="Creative work"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Imagen 2 (secundaria) */}
            <div className="absolute bottom-[5%] right-[5%] w-[55%] h-[60%] rounded-3xl overflow-hidden shadow-2xl animate-float-medium border-4 border-white">
              <Image
                src="/images/sections/hero-2.jpg"
                alt="Design work"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </div>

            {/* Triángulos decorativos encima */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-peach triangle-clip animate-float-fast z-10" />
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-sage triangle-clip rotate-180 animate-float-slow z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}