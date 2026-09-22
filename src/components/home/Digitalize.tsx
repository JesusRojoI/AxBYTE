'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import FlickeringGrid from '@/components/ui/FlickeringGrid';

export default function Digitalize() {
  const t = useTranslations('home.digitalize');

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        backgroundColor: '#FAFAF8',
        minHeight: '520px',
      }}
    >
      {/* Flickering Grid de fondo */}
      <div className="absolute inset-0">
        <FlickeringGrid
          color="#F5C7B1"
          squareSize={5}
          gridGap={8}
          maxOpacity={0.5}
          flickerChance={0.15}
        />
      </div>

      {/* Degradado blanco para garantizar legibilidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(250,250,248,0.85) 0%, rgba(250,250,248,0.6) 50%, rgba(250,250,248,0.3) 100%)',
        }}
      />

      {/* Contenido */}
      <div className="relative max-w-[1400px] mx-auto px-6 text-center">
        <h2
          className="font-display font-extrabold leading-[1.05] mb-6 animate-[slideUp_.8s_ease-out]"
          style={{
            color: '#1A1A1A',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            textShadow: '0 2px 20px rgba(250,250,248,0.9)',
          }}
        >
          {t('title')}
        </h2>

        <p
          className="mb-12 max-w-2xl mx-auto animate-[slideUp_.8s_ease-out_.1s_both]"
          style={{
            color: '#4A4A4A',
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            lineHeight: 1.5,
            textShadow: '0 1px 10px rgba(250,250,248,0.8)',
          }}
        >
          {t('subtitle')}
        </p>

        <div className="animate-[slideUp_.8s_ease-out_.2s_both]">
          <Button href="/contacto/" variant="primary" size="lg" icon="bi-arrow-right" iconRight>
            {t('button')}
          </Button>
        </div>
      </div>
    </section>
  );
}