import CartClient from '@/components/carrito/CartClient';

export const metadata = { title: 'Carrito | AxBYTE' };

export default function CarritoPage() {
  return (
    <section className="min-h-screen bg-[#FAFAF8]">
      <CartClient />
    </section>
  );
}