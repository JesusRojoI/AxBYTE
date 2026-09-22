'use client';

import { useTranslations } from 'next-intl';
import { CategoryKey, CATEGORY_COUNTS } from '@/data/services';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: CategoryKey[];
  onChange: (cats: CategoryKey[]) => void;
}

const CATEGORIES: CategoryKey[] = [
  'graphic',
  'web',
  'marketing',
  'print',
  'brand',
  'multimedia',
  'other',
];

const CATEGORY_I18N: Record<CategoryKey, string> = {
  graphic: 'graphic',
  web: 'web',
  marketing: 'marketing',
  print: 'print',
  brand: 'brand',
  multimedia: 'multimedia',
  other: 'other',
};

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const t = useTranslations('shop.category');

  const toggle = (cat: CategoryKey) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <h3 className="font-display font-extrabold text-2xl text-ink mb-6 flex items-center gap-3">
        <span className="w-2 h-2 bg-peach rounded-full" />
        {useTranslations('shop')('filters')}
      </h3>

      <ul className="space-y-2">
        {CATEGORIES.map((cat) => {
          const active = selected.includes(cat);
          return (
            <li key={cat}>
              <button
                onClick={() => toggle(cat)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-left group',
                  active
                    ? 'bg-peach/20 text-peach-dark font-semibold border border-peach/40'
                    : 'text-ink/75 hover:bg-peach/10 border border-transparent'
                )}
              >
                <span className="flex items-center gap-3">
                  {/* Checkbox visual */}
                  <span
                    className={cn(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0',
                      active
                        ? 'bg-peach-dark border-peach-dark'
                        : 'border-neutralgray/30 group-hover:border-peach'
                    )}
                  >
                    {active && <i className="bi bi-check text-white text-xs" />}
                  </span>
                  <span>{t(CATEGORY_I18N[cat])}</span>
                </span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full transition-colors',
                    active ? 'bg-peach-dark text-white' : 'bg-neutralgray/10 text-ink/60'
                  )}
                >
                  {CATEGORY_COUNTS[cat]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="mt-4 text-xs text-ink/50 hover:text-peach-dark transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-x-circle" />
          Limpiar filtros ({selected.length})
        </button>
      )}
    </aside>
  );
}