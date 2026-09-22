'use client';

import { cn } from '@/lib/utils';

interface TriangleBgProps {
  variant?: 'drift' | 'static' | 'grid';
  className?: string;
  count?: number;
}

/**
 * Fondo decorativo con triángulos animados o estáticos.
 * Evoca el logo de AxBYTE.
 */
export default function TriangleBg({
  variant = 'drift',
  className,
  count = 12,
}: TriangleBgProps) {
  const colors = ['#F5C7B1', '#D9F0D3', '#808080'];

  const triangles = Array.from({ length: count }).map((_, i) => {
    const size = 30 + ((i * 13) % 90);
    const top = (i * 37) % 100;
    const left = (i * 53) % 100;
    const color = colors[i % colors.length];
    const delay = (i * 0.4) % 5;
    const duration = 12 + (i % 5) * 2;
    const rotate = (i * 37) % 360;
    const opacity = 0.06 + ((i * 7) % 12) / 100;

    return (
      <div
        key={i}
        className={cn(
          'absolute triangle-clip',
          variant === 'drift' && 'animate-triangle-drift'
        )}
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
          background: color,
          opacity,
          transform: `rotate(${rotate}deg)`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  if (variant === 'grid') {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tri-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,5 55,50 5,50" fill="none" stroke="#1A1A1A" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tri-pattern)" />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {triangles}
    </div>
  );
}