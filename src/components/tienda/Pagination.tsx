'use client';

import { useState } from 'react';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {/* Botón anterior */}
      {current > 1 && (
        <button
          onClick={() => onChange(current - 1)}
          aria-label="Previous"
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{
            border: '1px solid rgba(128,128,128,0.2)',
            color: '#1A1A1A',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = '#E89B7A';
            el.style.color = '#E89B7A';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(128,128,128,0.2)';
            el.style.color = '#1A1A1A';
          }}
        >
          <i className="bi bi-arrow-left" />
        </button>
      )}

      {/* Números */}
      {pages.map((p) => {
        const isActive = p === current;
        const isHovered = hovered === p && !isActive;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered(null)}
            aria-current={isActive ? 'page' : undefined}
            className="min-w-10 h-10 px-3 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-200"
            style={{
              backgroundColor: isActive
                ? '#1A1A1A' // 🌟 fondo oscuro para activo
                : isHovered
                ? 'rgba(245,199,177,0.25)'
                : 'transparent',
              color: isActive
                ? '#FFFFFF' // 🌟 texto BLANCO sobre fondo oscuro
                : isHovered
                ? '#E89B7A'
                : '#1A1A1A',
              border: isActive
                ? '2px solid #1A1A1A' // 🌟 borde oscuro para resaltar
                : '2px solid transparent',
              boxShadow: isActive
                ? '0 4px 12px -4px rgba(26,26,26,0.4)'
                : 'none',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {p}
          </button>
        );
      })}

      {/* Botón siguiente */}
      {current < total && (
        <button
          onClick={() => onChange(current + 1)}
          aria-label="Next"
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{
            border: '1px solid rgba(128,128,128,0.2)',
            color: '#1A1A1A',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = '#E89B7A';
            el.style.color = '#E89B7A';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(128,128,128,0.2)';
            el.style.color = '#1A1A1A';
          }}
        >
          <i className="bi bi-arrow-right" />
        </button>
      )}
    </div>
  );
}