'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  variant?: 'success' | 'error' | 'info';
}

export default function Modal({ open, onClose, children, title, variant = 'info' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const accent =
    variant === 'success' ? '#B5DFA8' :
    variant === 'error' ? '#F5C7B1' :
    '#D9F0D3';

  const icon =
    variant === 'success' ? 'bi-check-circle-fill' :
    variant === 'error' ? 'bi-exclamation-triangle-fill' :
    'bi-info-circle-fill';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[slideUp_.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Triángulo decorativo */}
        <div
          className="absolute -top-3 -right-3 w-16 h-16 triangle-clip"
          style={{ background: accent, opacity: 0.4 }}
        />

        {/* Botón X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-neutralgray/5 hover:bg-neutralgray/10 transition-colors"
          aria-label="Cerrar"
        >
          <i className="bi bi-x-lg text-ink text-sm" />
        </button>

        {/* Icono */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: `${accent}55` }}
        >
          <i className={cn('bi', icon, 'text-3xl')} style={{ color: '#1A1A1A' }} />
        </div>

        {title && (
          <h3 className="font-display font-extrabold text-2xl mb-3 text-ink">
            {title}
          </h3>
        )}
        <div className="text-ink/80 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}