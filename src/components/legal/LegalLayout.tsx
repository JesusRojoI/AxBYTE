'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import TriangleBg from '@/components/ui/TriangleBg';

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  const t = useTranslations('legal');

  return (
    <section className="relative min-h-screen py-24 bg-[#FAFAF8] overflow-hidden">
      <TriangleBg variant="drift" count={8} />

      <div className="relative max-w-[900px] mx-auto px-6">
        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink mb-10 leading-tight">
          {title}
        </h1>

        <div
          className="legal-content bg-white rounded-3xl border border-neutralgray/10 p-8 md:p-12"
          style={{
            color: '#1A1A1A',
            fontSize: '15px',
            lineHeight: 1.75,
          }}
        >
          {children}
        </div>
      </div>

      {/* Estilos inline para el contenido legal */}
      <style jsx global>{`
        .legal-content p {
          margin-bottom: 1rem;
        }
        .legal-content h2 {
          font-family: var(--font-nunito), system-ui, sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1a1a1a;
        }
        .legal-content h3 {
          font-family: var(--font-nunito), system-ui, sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }
        .legal-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .legal-content li {
          margin-bottom: 0.5rem;
        }
        .legal-content strong {
          font-weight: 700;
        }
        .legal-updated {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(128, 128, 128, 0.15);
          font-size: 0.875rem;
          color: #808080;
          font-style: italic;
        }
      `}</style>
    </section>
  );
}