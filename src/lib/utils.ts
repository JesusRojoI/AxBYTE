import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

export const formatMXN = (n: number): string => `MXN$${formatPrice(n)}`;

export const IVA_RATE = 0.16;
export const calcVAT = (subtotal: number): number =>
  Number((subtotal * IVA_RATE).toFixed(2));
export const calcTotal = (subtotal: number): number =>
  Number((subtotal * (1 + IVA_RATE)).toFixed(2));