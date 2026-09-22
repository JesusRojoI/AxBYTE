'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import TriangleBg from '@/components/ui/TriangleBg';
import Process from '@/components/home/Process';

export default function AboutClient() {
  const t = useTranslations('about');

  return (
    <>
      {/* ============ SECCIÓN 1 — HERO ============ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image
          src="/images/sections/about-hero.jpg"
          alt="About AxBYTE"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/75" />

        {/* Triángulos decorativos */}
        <div className="absolute top-16 right-[10%] w-32 h-32 bg-peach/40 triangle-clip animate-float-slow" />
        <div className="absolute bottom-16 left-[8%] w-24 h-24 bg-sage/40 triangle-clip rotate-180 animate-float-medium" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-peach">
              <span className="w-8 h-0.5 bg-peach" />
              {t('tag')}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] text-white mb-6 animate-[slideUp_.8s_ease-out]">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed animate-[slideUp_.8s_ease-out_.1s_both]">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 2 — ABOUT + IMÁGENES ============ */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <TriangleBg variant="grid" />

        <div className="relative max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            {/* Columna izquierda — título + botón */}
            <div className="lg:col-span-1">
              <div className="inline-flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-peach-dark">
                <span className="w-8 h-0.5 bg-peach-dark" />
                {t('aboutTag')}
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-ink mb-6">
                {t('oneStop')}
              </h2>
              <Button href="/tienda/" variant="primary" icon="bi-grid">
                {t('allServices')}
              </Button>

              {/* Imagen 1 */}
              <div className="relative mt-10 rounded-2xl overflow-hidden aspect-[4/3] shadow-soft">
                <Image
                  src="/images/sections/about-1.jpg"
                  alt="Team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-peach triangle-clip rotate-180 animate-float-fast" />
              </div>
            </div>

            {/* Columna central — párrafos */}
            <div className="lg:col-span-2 space-y-6 text-ink/75 text-base md:text-lg leading-relaxed">
              <p>{t('paragraph1')}</p>
              <p>{t('paragraph2')}</p>

              {/* Imagen 2 intercalada */}
              <div className="relative my-8 rounded-2xl overflow-hidden aspect-[16/7] shadow-soft">
                <Image
                  src="/images/sections/about-2.jpg"
                  alt="Office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 w-16 h-16 bg-sage triangle-clip animate-float-medium" />
              </div>

              <p>{t('paragraph3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 3 — Proceso (reutilizado) ============ */}
      <Process />

      {/* ============ SECCIÓN 4 — Impacto ============ */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Izquierda 60% — texto */}
            <div className="lg:col-span-3">
              <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.05] text-ink mb-6">
                {t('impactTitle')}
              </h2>
              <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-2xl">
                {t('impactDesc')}
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-peach-dark mb-8">
                {t('trusted')}
              </p>
              <Button href="/contacto/" variant="primary" size="lg" icon="bi-arrow-right" iconRight>
                {t('contactBtn')}
              </Button>
            </div>

            {/* Derecha 40% — imagen */}
            <div className="lg:col-span-2 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage triangle-clip rotate-180 animate-float-slow z-10" />
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="/images/sections/about-impact.jpg"
                  alt="Impact"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-peach triangle-clip animate-float-fast z-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}