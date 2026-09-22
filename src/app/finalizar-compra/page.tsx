import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata = { title: 'Finalizar compra | AxBYTE' };

export default function CheckoutPage() {
  return (
    <section className="min-h-screen bg-[#FAFAF8]">
      <CheckoutClient />
    </section>
  );
}