'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CategoryKey, Service, services, sortServices } from '@/data/services';
import ServiceCard from '@/components/tienda/ServiceCard';
import CategoryFilter from '@/components/tienda/CategoryFilter';
import SortDropdown, { SortMode } from '@/components/tienda/SortDropdown';
import Pagination from '@/components/tienda/Pagination';

const ITEMS_PER_PAGE = 16;

export default function ShopClient() {
  const t = useTranslations('shop');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ============ Estado derivado de URL ============
  const initialCats = (searchParams.get('cat')?.split(',').filter(Boolean) as CategoryKey[]) || [];
  const initialSort = (searchParams.get('sort') as SortMode) || 'default';
  const initialPage = Number(searchParams.get('page') || '1');

  const [cats, setCats] = useState<CategoryKey[]>(initialCats);
  const [sort, setSort] = useState<SortMode>(initialSort);
  const [page, setPage] = useState(initialPage);

  // ============ Sincronizar URL ============
  useEffect(() => {
    const params = new URLSearchParams();
    if (cats.length) params.set('cat', cats.join(','));
    if (sort !== 'default') params.set('sort', sort);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    const target = qs ? `${pathname}?${qs}` : pathname;
    router.replace(target, { scroll: false });
  }, [cats, sort, page, pathname, router]);

  // ============ Filtrado + ordenamiento ============
  const filtered = useMemo(() => {
    let list: Service[] = services;
    if (cats.length > 0) {
      // Deduplicar por si un servicio pertenece a varias categorías
      const set = new Set<Service>();
      cats.forEach((c) => {
        services.forEach((s) => {
          if (s.categories.includes(c)) set.add(s);
        });
      });
      list = Array.from(set);
    }
    return sortServices(list, sort);
  }, [cats, sort]);

  // ============ Paginación ============
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const from = (safePage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE;
  const visible = filtered.slice(from, to);

  // Resetear página si filtros cambian y estamos fuera de rango
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const showingFrom = filtered.length === 0 ? 0 : from + 1;
  const showingTo = Math.min(to, filtered.length);

  return (
    <section className="relative bg-[#FAFAF8] min-h-screen">
      {/* ============ HEADER DE TIENDA ============ */}
      <div className="relative bg-gradient-to-br from-peach-light via-white to-sage-light overflow-hidden">
        {/* Triángulos decorativos */}
        <div className="absolute top-10 left-[8%] w-24 h-24 bg-peach/40 triangle-clip animate-float-slow" />
        <div className="absolute bottom-10 right-[12%] w-32 h-32 bg-sage/50 triangle-clip rotate-180 animate-float-medium" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-16 md:py-20">
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] text-ink mb-4 max-w-3xl">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ============ CONTENIDO ============ */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
          {/* ============ SIDEBAR ============ */}
          <CategoryFilter selected={cats} onChange={(c) => { setCats(c); setPage(1); }} />

          {/* ============ MAIN ============ */}
          <div>
            {/* Barra superior */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutralgray/10">
              <p className="text-sm text-ink/60">
                {t('showing', { from: showingFrom, to: showingTo, total: filtered.length })}
              </p>
              <SortDropdown value={sort} onChange={(s) => { setSort(s); setPage(1); }} />
            </div>

            {/* Grid de productos */}
            {visible.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {visible.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="inline-flex w-20 h-20 bg-peach/20 rounded-2xl items-center justify-center mb-5">
                  <i className="bi bi-search text-3xl text-peach-dark" />
                </div>
                <p className="text-ink/60">No se encontraron servicios con esos filtros.</p>
                <button
                  onClick={() => { setCats([]); setPage(1); }}
                  className="mt-4 text-peach-dark font-semibold underline underline-offset-4"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Paginación */}
            <Pagination current={safePage} total={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </section>
  );
}