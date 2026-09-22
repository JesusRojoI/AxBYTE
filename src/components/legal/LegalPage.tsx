'use client';

import { useTranslations } from 'next-intl';
import TriangleBg from '@/components/ui/TriangleBg';

interface LegalPageProps {
  titleKey: string;
}

export default function LegalPage({ titleKey }: LegalPageProps) {
  const t = useTranslations('legal');

  return (
    <section className="relative min-h-[70vh] py-24 bg-[#FAFAF8] overflow-hidden">
      <TriangleBg variant="drift" count={10} />

      <div className="relative max-w-[900px] mx-auto px-6">
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink mb-8">
          {t(titleKey)}
        </h1>

        <div className="bg-white rounded-3xl border border-neutralgray/10 p-8 md:p-12">
          <div className="flex items-start gap-4 p-6 bg-peach/15 rounded-2xl mb-6">
            <i className="bi bi-info-circle-fill text-peach-dark text-2xl shrink-0" />
            <p className="text-ink/80 leading-relaxed">{t('comingSoon')}</p>
          </div>
          <p className="text-ink/70">
            {t('contact')}{' '}
            <a
              href="mailto:soluciones@axbyte.com.mx"
              className="text-peach-dark font-semibold underline underline-offset-2"
            >
              soluciones@axbyte.com.mx
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}