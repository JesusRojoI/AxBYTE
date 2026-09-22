'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export type SortMode = 'default' | 'popularity' | 'newest' | 'priceDesc' | 'priceAsc';

interface SortDropdownProps {
  value: SortMode;
  onChange: (mode: SortMode) => void;
}

const OPTIONS: SortMode[] = ['default', 'popularity', 'newest', 'priceDesc', 'priceAsc'];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const t = useTranslations('shop.sortOptions');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const labelKey: Record<SortMode, string> = {
    default: 'default',
    popularity: 'popularity',
    newest: 'newest',
    priceDesc: 'priceDesc',
    priceAsc: 'priceAsc',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-3 px-5 py-3 bg-white border border-neutralgray/15 rounded-xl text-sm font-medium',
          'hover:border-peach transition-colors min-w-[220px] justify-between',
          open && 'border-peach shadow-soft'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-ink/80">{t(labelKey[value])}</span>
        <i className={cn('bi bi-chevron-down text-ink/50 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-0 mt-2 w-full min-w-[260px] bg-white border border-neutralgray/15 rounded-xl shadow-[0_20px_60px_-15px_rgba(128,128,128,0.3)] overflow-hidden z-30 animate-[fadeIn_.15s_ease-out]"
        >
          {OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  'w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between',
                  value === opt
                    ? 'bg-peach/15 text-peach-dark font-semibold'
                    : 'text-ink/80 hover:bg-peach/10'
                )}
              >
                {t(labelKey[opt])}
                {value === opt && <i className="bi bi-check2 text-peach-dark" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}