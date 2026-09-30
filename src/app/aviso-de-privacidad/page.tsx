'use client';

import { useTranslations } from 'next-intl';
import LegalLayout from '@/components/legal/LegalLayout';

export default function AvisoPage() {
  const t = useTranslations('legalContent.privacy');
  const tLegal = useTranslations('legal');

  return (
    <LegalLayout title={tLegal('privacyTitle')}>
      <p>{t('intro1')}</p>
      <p>{t('intro2')}</p>
      <p>{t('intro3')}</p>

      <h2>{t('collectedTitle')}</h2>
      <p>{t('collectedText1')}</p>
      <p>{t('collectedText2')}</p>

      <h2>{t('useTitle')}</h2>
      <p>{t('useText1')}</p>
      <p>{t('useText2')}</p>
      <p>{t('useText3')}</p>

      <h2>{t('cookiesTitle')}</h2>
      <p>{t('cookiesText1')}</p>
      <p>{t('cookiesText2')}</p>
      <p>{t('cookiesText3')}</p>
      <p>{t('cookiesText4')}</p>
      <p>{t('cookiesText5')}</p>

      <h2>{t('linksTitle')}</h2>
      <p>{t('linksText1')}</p>
      <p>{t('linksText2')}</p>

      <h2>{t('controlTitle')}</h2>
      <p>{t('controlText1')}</p>
      <p>{t('controlText2')}</p>

      <h2>{t('arcoTitle')}</h2>
      <p>{t('arcoText1')}</p>
      <p>{t('arcoIntro')}</p>
      <ul>
        <li>{t('arcoItem1')}</li>
        <li>{t('arcoItem2')}</li>
        <li>{t('arcoItem3')}</li>
        <li>{t('arcoItem4')}</li>
      </ul>
      <p>{t('arcoText2')}</p>

      <h2>{t('modsTitle')}</h2>
      <p>{t('modsText')}</p>

      <p className="legal-updated">{t('updated')}</p>
    </LegalLayout>
  );
}