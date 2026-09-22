'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  tag?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  light?: boolean;
}

export default function SectionTitle({
  tag,
  title,
  description,
  align = 'left',
  className,
  light = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        align === 'right' && 'ml-auto text-right',
        className
      )}
    >
      {tag && (
        <div
          className={cn(
            'inline-flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-[0.2em]',
            light ? 'text-peach' : 'text-peach-dark'
          )}
        >
          <span className="w-6 h-0.5 bg-current" />
          {tag}
        </div>
      )}
      <h2
        className={cn(
          'font-display font-extrabold text-4xl md:text-5xl leading-[1.05] mb-5',
          light ? 'text-white' : 'text-ink'
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('text-base leading-relaxed', light ? 'text-white/70' : 'text-ink/70')}>
          {description}
        </p>
      )}
    </div>
  );
}