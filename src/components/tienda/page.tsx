import { Suspense } from 'react';
import ShopClient from '@/components/tienda/ShopClient';

export const metadata = {
  title: 'Tienda de Servicios | AxBYTE',
};

export const dynamic = 'force-dynamic';

export default function TiendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-peach border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink/50 text-sm">Cargando tienda...</p>
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}