import { notFound } from 'next/navigation';
import { getServiceBySlug, services } from '@/data/services';
import ProductDetail from '@/components/producto/ProductDetail';
import RelatedProducts from '@/components/producto/RelatedProducts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Producto no encontrado | AxBYTE' };
  return {
    title: `${service.slug.replace(/-/g, ' ')} | AxBYTE`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <ProductDetail service={service} />
      <RelatedProducts slugs={service.related} />
    </>
  );
}