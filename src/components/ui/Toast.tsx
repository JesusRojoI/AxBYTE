'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  open: boolean;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
  onClose?: () => void;
  duration?: number;
}

export default function Toast({
  open,
  message,
  undoLabel,
  onUndo,
  onClose,
  duration = 6000,
}: ToastProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
    if (!open) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-24 left-6 z-[90] max-w-sm',
        'bg-ink text-white rounded-2xl shadow-2xl px-5 py-4',
        'flex items-center gap-4 animate-[slideUp_.3s_ease-out]'
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-peach/20 flex items-center justify-center shrink-0">
        <i className="bi bi-trash text-peach" />
      </div>
      <p className="text-sm flex-1">
        <span className="font-semibold">{message}</span>
        {undoLabel && onUndo && (
          <>
            {' '}
            <button
              onClick={onUndo}
              className="text-peach underline underline-offset-2 hover:text-peach-dark font-semibold transition-colors"
            >
              {undoLabel}
            </button>
          </>
        )}
      </p>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="text-white/50 hover:text-white transition-colors shrink-0"
        aria-label="Cerrar"
      >
        <i className="bi bi-x-lg text-xs" />
      </button>
    </div>
  );
}