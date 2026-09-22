'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { Locale } from '@/i18n/request';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next: Locale = locale === 'es' ? 'en' : 'es';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => router.refresh());
  };

  const isEs = locale === 'es';

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="fixed bottom-6 right-6 z-[60] group"
      aria-label="Switch language"
    >
      <div className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white rounded-full shadow-[0_8px_32px_-8px_rgba(128,128,128,0.35)] border border-neutralgray/10 transition-all duration-300 hover:shadow-[0_12px_40px_-8px_rgba(245,199,177,0.6)] hover:scale-105">
        {/* Bandera */}
        <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-peach/30 group-hover:ring-peach transition-all">
          {isEs ? <FlagMX /> : <FlagUS />}
        </div>
        {/* Prefijo */}
        <span className="text-xs font-bold text-ink tracking-wider">
          {isEs ? 'ES' : 'EN'}
        </span>
        <i className={`bi bi-arrow-left-right text-xs text-neutralgray group-hover:text-peach-dark transition-colors ${isPending ? 'animate-spin' : ''}`} />
      </div>
    </button>
  );
}

function FlagMX() {
  return (
    <svg viewBox="0 0 512 512" className="w-full h-full">
      <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
      <path d="m512 256c0-101.494-59.065-189.19-144.696-230.598v461.195c85.631-41.407 144.696-129.103 144.696-230.597z" fill="#d80027" />
      <g fill="#6da544">
        <path d="m0 256c0 101.494 59.065 189.19 144.696 230.598v-461.196c-85.631 41.408-144.696 129.104-144.696 230.598z" />
        <path d="m189.217 256c0 36.883 29.9 66.783 66.783 66.783s66.783-29.9 66.783-66.783v-22.261h-133.566z" />
      </g>
      <path d="m345.043 211.478h-66.783c0-12.294-9.967-22.261-22.261-22.261s-22.261 9.967-22.261 22.261h-66.783c0 12.295 10.709 22.261 23.002 22.261h-.741c0 12.295 9.966 22.261 22.261 22.261 0 12.295 9.966 22.261 22.261 22.261h44.522c12.295 0 22.261-9.966 22.261-22.261 12.295 0 22.261-9.966 22.261-22.261h-.742c12.295 0 23.003-9.966 23.003-22.261z" fill="#ff9811" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 512 512" className="w-full h-full">
      <circle cx="256" cy="256" fill="#f0f0f0" r="256" />
      <g fill="#d80027">
        <path d="m244.87 256h267.13c0-23.106-3.08-45.49-8.819-66.783h-258.311z" />
        <path d="m244.87 122.435h229.556c-15.671-25.572-35.708-48.175-59.07-66.783h-170.486z" />
        <path d="m256 512c60.249 0 115.626-20.824 159.356-55.652h-318.712c43.73 34.828 99.107 55.652 159.356 55.652z" />
        <path d="m37.574 389.565h436.852c12.581-20.529 22.338-42.969 28.755-66.783h-494.362c6.417 23.814 16.174 46.254 28.755 66.783z" />
      </g>
      <path d="m118.584 39.978h23.329l-21.7 15.765 8.289 25.509-21.699-15.765-21.699 15.765 7.16-22.037c-19.106 15.915-35.852 34.561-49.652 55.337h7.475l-13.813 10.035c-2.152 3.59-4.216 7.237-6.194 10.938l6.596 20.301-12.306-8.941c-3.059 6.481-5.857 13.108-8.372 19.873l7.267 22.368h26.822l-21.7 15.765 8.289 25.509-21.699-15.765-12.998 9.444c-1.301 10.458-1.979 21.11-1.979 31.921h256c0-141.384 0-158.052 0-256-50.572 0-97.715 14.67-137.416 39.978zm9.918 190.422-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822l-21.7 15.765zm-8.289-100.083 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822zm100.115 100.083-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822l-21.7 15.765zm-8.289-100.083 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822zm0-74.574 8.289 25.509-21.699-15.765-21.699 15.765 8.289-25.509-21.7-15.765h26.822l8.288-25.509 8.288 25.509h26.822z" fill="#0052b4" />
    </svg>
  );
}