'use client';

import { useTranslations } from 'next-intl';
import LegalLayout from '@/components/legal/LegalLayout';

export default function PoliticasPage() {
  const t = useTranslations('legalContent.returns');
  const tLegal = useTranslations('legal');

  return (
    <LegalLayout title={tLegal('returnsTitle')}>
      <p>{t('intro')}</p>

      <h2>{t('defTitle')}</h2>
      <p>
        <strong>{t('client').split(':')[0]}:</strong>
        {t('client').substring(t('client').indexOf(':') + 1)}
      </p>
      <p>
        <strong>{t('provider').split(':')[0]}:</strong>
        {t('provider').substring(t('provider').indexOf(':') + 1)}
      </p>

      <p>{t('readCarefully')}</p>

      <p>{t('item1')}</p>
      <p>{t('item2')}</p>
      <p>{t('item3')}</p>
      <p>{t('item4')}</p>

      <p>{t('intro2')}</p>

      <h2>{t('returnsTitle')}</h2>
      <p>{t('returnsIntro')}</p>
      <p>{t('ret1')}</p>
      <p>{t('ret2')}</p>
      <p>{t('ret3')}</p>
      <p>{t('ret4')}</p>
      <p>{t('ret5')}</p>
      <p>{t('ret6')}</p>
      <p>{t('retNote')}</p>

      <h2>{t('eligibleTitle')}</h2>
      <p>{t('eligibleText1')}</p>
      <p>{t('eligibleText2')}</p>
      <p>{t('eligibleText3')}</p>

      <h2>{t('refundTitle')}</h2>
      <p>{t('refundText1')}</p>
      <p>{t('refundText2')}</p>
      <p>{t('refundText3')}</p>

      <h3>{t('exclusionsTitle')}</h3>
      <ul>
        <li>{t('excl1')}</li>
        <li>{t('excl2')}</li>
      </ul>
      <p>{t('refundNote')}</p>

      <h2>{t('deliveryTitle')}</h2>
      <p>{t('deliveryText1')}</p>
      <p>{t('deliveryText2')}</p>
      <p>{t('deliveryText3')}</p>
      <p>{t('deliveryText4')}</p>
      <p>{t('deliveryText5')}</p>

      <h2>{t('communicationTitle')}</h2>
      <p>{t('communicationText')}</p>

      <h2>{t('modsTitle')}</h2>
      <p>{t('modsText')}</p>

      <p className="legal-updated">{t('updated')}</p>
    </LegalLayout>
  );
}