'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  color?: string;
  maxOpacity?: number;
  flickerChance?: number;
  className?: string;
}

/**
 * Rejilla animada tipo "Flickering Grid" (inspirada en Velora UI for React).
 * Canvas puro, sin dependencias, muy liviana.
 */
export default function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  color = '#F5C7B1',
  maxOpacity = 0.4,
  flickerChance = 0.3,
  className,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<Float32Array | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rgb = hexToRgb(color);
    const cellSize = squareSize + gridGap;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      squaresRef.current = new Float32Array(cols * rows);
      for (let i = 0; i < squaresRef.current.length; i++) {
        squaresRef.current[i] = Math.random();
      }
    };

    const draw = () => {
      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      const squares = squaresRef.current;
      if (!squares) return;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j;
          if (idx >= squares.length) continue;
          if (Math.random() < flickerChance) {
            squares[idx] = Math.random();
          }
          const opacity = squares[idx] * maxOpacity;
          if (opacity < 0.01) continue;
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          ctx.fillRect(i * cellSize, j * cellSize, squareSize, squareSize);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener('resize', resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [squareSize, gridGap, color, maxOpacity, flickerChance]);

  return (
    <div ref={containerRef} className={cn('absolute inset-0', className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}