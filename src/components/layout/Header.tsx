'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function Header() {
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const { totalItems, subtotal, isHydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!isHydrated || totalItems === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(timer);
  }, [totalItems, isHydrated]);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/nosotros/', label: t('about') },
    { href: '/tienda/', label: t('services') },
    { href: '/personaliza/', label: t('customize') },
    { href: '/contacto/', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.replace(/\/$/, ''));
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#FAFAF8',
        borderBottom: '1px solid rgba(128,128,128,0.1)',
        boxShadow: scrolled ? '0 4px 24px -8px rgba(128,128,128,0.15)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0 flex items-center group"
          aria-label="AxBYTE Home"
        >
          <div className="relative w-24 h-24 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <Image
              src="/logo.svg"
              alt="AxBYTE"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* NAV CENTRAL */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
                style={{
                  color: active ? '#E89B7A' : 'rgba(26,26,26,0.7)',
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'rgba(245,199,177,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'transparent';
                }}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45"
                    style={{ backgroundColor: '#E89B7A' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <Link
            href="/carrito/"
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group"
            aria-label={`${t('cart')} — ${totalItems} items`}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'rgba(217,240,211,0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'transparent';
            }}
          >
            <div
              className="relative"
              style={{
                animation: bump ? 'bump 0.4s ease-out' : undefined,
              }}
            >
              <i
                className="bi bi-cart3 text-2xl transition-colors"
                style={{ color: '#1A1A1A' }}
              />

              {/* BADGE CONTADOR */}
              {isHydrated && totalItems > 0 && (
                <span
                  className="absolute min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full font-bold"
                  style={{
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#E89B7A',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    border: '2px solid #FAFAF8',
                    lineHeight: 1,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </div>

            <span
              className="hidden md:inline text-sm font-semibold tabular-nums"
              style={{ color: '#1A1A1A' }}
            >
              {tCommon('currency')}${isHydrated ? formatPrice(subtotal) : '0.00'}
            </span>
          </Link>

          {/* BOTÓN CONTRATAR */}
          <Link
            href="/tienda/"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 group"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = '#E89B7A';
              el.style.gap = '12px';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = '#1A1A1A';
              el.style.gap = '8px';
            }}
          >
            <span>{t('hire')}</span>
            <i className="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            aria-label="Menu"
            style={{ color: '#1A1A1A' }}
          >
            <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`} />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? '384px' : '0',
          backgroundColor: '#FAFAF8',
          borderTop: mobileOpen ? '1px solid rgba(128,128,128,0.1)' : 'none',
        }}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(245,199,177,0.3)' : 'transparent',
                  color: active ? '#E89B7A' : 'rgba(26,26,26,0.8)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/tienda/"
            className="mt-2 px-4 py-3 text-sm font-semibold rounded-lg text-center"
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          >
            {t('hire')}
          </Link>
        </nav>
      </div>
    </header>
  );
}