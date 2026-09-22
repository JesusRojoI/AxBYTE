'use client';

import { useTranslations } from 'next-intl';
import TriangleBg from '@/components/ui/TriangleBg';

export default function Process() {
  const t = useTranslations('home.process');

  const steps = [
    { n: '01', title: t('step1.title'), desc: t('step1.description') },
    { n: '02', title: t('step2.title'), desc: t('step2.description') },
    { n: '03', title: t('step3.title'), desc: t('step3.description') },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-peach-light via-white to-sage-light">
      <TriangleBg variant="grid" />
      <TriangleBg variant="drift" count={10} />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Número grande */}
              <div className="font-display font-extrabold text-[7rem] md:text-[9rem] leading-none text-ink/5 group-hover:text-peach/30 transition-colors duration-500 select-none">
                {step.n}
              </div>

              <div className="-mt-16 relative z-10">
                <div className="w-14 h-14 bg-ink text-white rounded-2xl flex items-center justify-center mb-5 group-hover:bg-peach-dark group-hover:scale-110 transition-all duration-300">
                  <span className="font-display font-extrabold">{step.n}</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-ink mb-3">
                  {step.title}
                </h3>
                <p className="text-ink/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Línea conectora */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-5 w-10 h-0.5 bg-peach-dark/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}