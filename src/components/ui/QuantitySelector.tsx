'use client';

import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  className?: string;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  className,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => onChange(value + 1);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
    if (!isNaN(n) && n >= min) onChange(n);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border border-neutralgray/20 rounded-xl overflow-hidden bg-white',
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="w-11 h-12 flex items-center justify-center text-ink/70 hover:bg-peach/15 hover:text-peach-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrement"
      >
        <i className="bi bi-dash-lg" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInput}
        className="w-14 h-12 text-center font-display font-bold text-ink bg-transparent outline-none tabular-nums"
      />
      <button
        type="button"
        onClick={increment}
        className="w-11 h-12 flex items-center justify-center text-ink/70 hover:bg-peach/15 hover:text-peach-dark transition-colors"
        aria-label="Increment"
      >
        <i className="bi bi-plus-lg" />
      </button>
    </div>
  );
}