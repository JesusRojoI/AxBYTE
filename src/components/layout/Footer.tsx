'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0F0F0F', color: '#FFFFFF' }}
    >
      {/* ============ TRAMA OSCURA DE FONDO ============ */}
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.06 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F5C7B1" strokeWidth="1" />
          </pattern>
          <pattern id="footer-tri" width="120" height="120" patternUnits="userSpaceOnUse">
            <polygon
              points="60,20 100,90 20,90"
              fill="none"
              stroke="#D9F0D3"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-grid)" />
        <rect width="100%" height="100%" fill="url(#footer-tri)" />
      </svg>

      {/* Triángulos decorativos grandes */}
      <div
        className="absolute top-0 left-0 w-48 h-48 pointer-events-none triangle-clip"
        style={{ backgroundColor: 'rgba(245,199,177,0.08)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none triangle-clip rotate-180"
        style={{ backgroundColor: 'rgba(217,240,211,0.08)' }}
      />

      {/* ============ CONTENIDO ============ */}
      <div className="relative max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* ============ COLUMNA 1 ============ */}
          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 mb-5 group"
              aria-label="Scroll top"
            >
              <div className="relative w-14 h-14 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Image
                  src="/logo.svg"
                  alt="AxBYTE"
                  fill
                  className="object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </button>

            <p
              className="text-sm leading-relaxed max-w-md"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {t('tagline')}
            </p>
          </div>

          {/* ============ COLUMNA 2 ============ */}
          <div>
            <h3
              className="font-display font-bold text-lg mb-5 flex items-center gap-2"
              style={{ color: '#FFFFFF' }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#F5C7B1' }}
              />
              {t('office')}
            </h3>

            <address
              className="not-italic text-sm leading-relaxed mb-5 whitespace-pre-line"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {t('address')}
            </address>

            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${t('email')}`}
                className="flex items-center gap-3 text-sm group transition-colors"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#F5C7B1';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                }}
              >
                <i className="bi bi-envelope transition-transform group-hover:scale-110" style={{ color: '#F5C7B1' }} />
                {t('email')}
              </a>
              <a
                href={`tel:${t('phone').replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-sm group transition-colors"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#F5C7B1';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                }}
              >
                <i className="bi bi-telephone transition-transform group-hover:scale-110" style={{ color: '#F5C7B1' }} />
                {t('phone')}
              </a>
            </div>

            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/aviso-de-privacidad/"
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#F5C7B1';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos-y-condiciones/"
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#F5C7B1';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/politicas-de-devoluciones-y-reembolsos/"
                  className="text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#F5C7B1';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {t('returns')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ============ PARTE INFERIOR ============ */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="text-center md:text-left">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('rights')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {t('acceptPayments')}
            </span>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-7 rounded px-1.5 py-1" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/visa.svg" alt="Visa" fill className="object-contain p-1" />
              </div>
              <div className="relative w-10 h-7 rounded px-1.5 py-1" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/mastercard.svg" alt="MasterCard" fill className="object-contain p-1" />
              </div>
              <div className="relative w-10 h-7 rounded px-1.5 py-1" style={{ backgroundColor: '#FFFFFF' }}>
                <Image src="/amex.svg" alt="Amex" fill className="object-contain p-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}