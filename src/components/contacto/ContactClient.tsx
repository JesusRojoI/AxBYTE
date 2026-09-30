'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useFormToken } from '@/lib/form-token';

export default function ContactClient() {
  const t = useTranslations('contact');
  const tFooter = useTranslations('footer');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isEn = locale === 'en';
  const formToken = useFormToken();

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    message: '',
    _website: '', // honeypot
  });
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState<{
    open: boolean;
    variant: 'success' | 'error';
    title: string;
    msg: string;
  }>({ open: false, variant: 'success', title: '', msg: '' });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): string | null => {
    if (!form.name.trim()) return isEn ? 'Name is required' : 'Nombre requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return isEn ? 'Invalid email' : 'Email inválido';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setModal({
        open: true,
        variant: 'error',
        title: t('formErrorTitle'),
        msg: err,
      });
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/send-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: form.email,
          type: 'contact',
          language: locale,
          name: `${form.name} ${form.lastName}`,
          company: '',
          email: form.email,
          phone: '',
          message: form.message,
          _token: formToken,
          _website: form._website,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModal({
          open: true,
          variant: 'success',
          title: t('formSuccessTitle'),
          msg: t('formSuccessMsg'),
        });
        setForm({ name: '', lastName: '', email: '', message: '', _website: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      setModal({
        open: true,
        variant: 'error',
        title: t('formErrorTitle'),
        msg:
          e.message ||
          (isEn
            ? 'Your message could not be sent. Please try again.'
            : 'No se pudo enviar tu mensaje. Intenta nuevamente.'),
      });
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-white border border-neutralgray/20 rounded-xl text-ink placeholder:text-ink/30 outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all';

  return (
    <>
      {/* ============ SECCIÓN 1 — HERO ============ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <Image
          src="/images/sections/contact-bg.jpg"
          alt="Contact"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ink/75" />

        <div className="absolute top-16 right-[10%] w-32 h-32 bg-peach/40 triangle-clip animate-float-slow" />

        <div className="relative max-w-[1400px] mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-peach">
              <span className="w-8 h-0.5 bg-peach" />
              {t('tag')}
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 2 — TARJETAS ============ */}
      <section className="relative py-20 md:py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <a
              href={`mailto:${tFooter('email')}`}
              className="group relative bg-gradient-to-br from-peach-light to-white rounded-3xl border border-neutralgray/10 p-8 hover:shadow-soft transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-peach rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <i className="bi bi-envelope-fill text-2xl text-ink" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-3">
                {t('emailTitle')}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed mb-5">
                {t('emailDesc')}
              </p>
              <span className="inline-flex items-center gap-2 text-peach-dark font-semibold group-hover:gap-3 transition-all">
                {tFooter('email')}
                <i className="bi bi-arrow-right" />
              </span>
            </a>

            <a
              href={`tel:${tFooter('phone').replace(/\s/g, '')}`}
              className="group relative bg-gradient-to-br from-sage-light to-white rounded-3xl border border-neutralgray/10 p-8 hover:shadow-soft transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-sage rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <i className="bi bi-telephone-fill text-2xl text-ink" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-3">
                {t('phoneTitle')}
              </h3>
              <p className="text-ink/70 text-sm leading-relaxed mb-5">
                {t('phoneDesc')}
              </p>
              <span className="inline-flex items-center gap-2 text-peach-dark font-semibold group-hover:gap-3 transition-all">
                {tFooter('phone')}
                <i className="bi bi-arrow-right" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 3 — FORMULARIO ============ */}
      <section className="relative py-20 md:py-24 bg-[#FAFAF8] overflow-hidden">
        <div className="absolute top-20 left-[5%] w-20 h-20 bg-peach/30 triangle-clip animate-float-slow" />

        <div className="relative max-w-[900px] mx-auto px-6">
          <div className="bg-white rounded-3xl border border-neutralgray/10 p-8 md:p-12">
            {/* Honeypot - invisible para humanos */}
            <div
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
              aria-hidden="true"
            >
              <label htmlFor="website-hp">Website</label>
              <input
                type="text"
                id="website-hp"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form._website}
                onChange={(e) => set('_website', e.target.value)}
              />
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('formName')} <span className="text-peach-dark">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    {t('formLastName')}
                  </label>
                  <input
                    type="text"
                    className={inputCls}
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {t('formEmail')} <span className="text-peach-dark">*</span>
                </label>
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  {t('formMessage')}
                </label>
                <textarea
                  rows={5}
                  className={inputCls + ' resize-none'}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="lg"
                fullWidth
                disabled={sending}
                icon={sending ? 'bi-arrow-repeat' : 'bi-send'}
              >
                {sending ? tCommon('loading') : t('formSubmit')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECCIÓN 4 — MAPA ============ */}
      <section className="relative py-20 md:py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-5">
                {t('findUs')}
              </h2>
              <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-xl">
                {t('findUsDesc')}
              </p>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-peach/30 rounded-xl flex items-center justify-center shrink-0">
                    <i className="bi bi-geo-alt-fill text-peach-dark text-xl" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-ink mb-1">
                      {t('office')}
                    </h3>
                    <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-line">
                      {tFooter('address')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-sage/30 rounded-xl flex items-center justify-center shrink-0">
                    <i className="bi bi-envelope-fill text-sage-dark text-xl" />
                  </div>
                  <div>
                    <a
                      href={`mailto:${tFooter('email')}`}
                      className="text-ink/80 hover:text-peach-dark transition-colors text-sm"
                    >
                      {tFooter('email')}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-peach/30 rounded-xl flex items-center justify-center shrink-0">
                    <i className="bi bi-telephone-fill text-peach-dark text-xl" />
                  </div>
                  <div>
                    <a
                      href={`tel:${tFooter('phone').replace(/\s/g, '')}`}
                      className="text-ink/80 hover:text-peach-dark transition-colors text-sm"
                    >
                      {tFooter('phone')}
                    </a>
                  </div>
                </div>

                
              </div>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-sage triangle-clip animate-float-slow z-10" />
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl border border-neutralgray/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5!2d-99.2!3d19.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDMwJzAwLjAiTiA5OcKwMTInMDAuMCJX!5e0!3m2!1ses!2smx!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AxBYTE Office"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        variant={modal.variant}
      >
        {modal.msg}
      </Modal>
    </>
  );
}