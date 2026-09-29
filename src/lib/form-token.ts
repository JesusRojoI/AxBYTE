'use client';

import { useEffect, useState } from 'react';

/**
 * Obtiene un token firmado del servidor para validar el formulario.
 * El token es único por render y expira en 2 horas.
 */
export function useFormToken(): string {
  const [token, setToken] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/form-token/')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.token) setToken(d.token);
      })
      .catch(() => {
        // Fallback: token local (menos seguro)
        if (!cancelled) setToken(`${Date.now()}.unsigned`);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return token;
}