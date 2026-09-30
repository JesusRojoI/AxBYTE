'use client';

import { useTranslations } from 'next-intl';
import LegalLayout from '@/components/legal/LegalLayout';

export default function TerminosPage() {
  const t = useTranslations('legalContent.terms');
  const tLegal = useTranslations('legal');

  return (
    <LegalLayout title={tLegal('termsTitle')}>
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

      <h2>{t('introTitle')}</h2>
      <p>{t('readCarefully')}</p>
      <p>{t('acceptWhen')}</p>
      <ul>
        <li>{t('acceptItem1')}</li>
        <li>{t('acceptItem2')}</li>
        <li>{t('acceptItem3')}</li>
      </ul>
      <p>{t('reserveRight')}</p>
      <p>{t('ifNotAccept')}</p>

      <h2>{t('generalTitle')}</h2>

      <h3>{t('scope')}</h3>
      <p>{t('scopeText')}</p>

      <h3>{t('restrictions')}</h3>
      <p>{t('restrictionsText1')}</p>
      <p>{t('restrictionsText2')}</p>
      <p>{t('restrictionsText3')}</p>
      <p>{t('restrictionsIntro')}</p>
      <ul>
        <li>{t('restrictItem1')}</li>
        <li>{t('restrictItem2')}</li>
        <li>{t('restrictItem3')}</li>
        <li>{t('restrictItem4')}</li>
        <li>{t('restrictItem5')}</li>
        <li>{t('restrictItem6')}</li>
        <li>{t('restrictItem7')}</li>
      </ul>

      <h3>{t('links')}</h3>
      <p>{t('linksText1')}</p>
      <p>{t('linksText2')}</p>
      <p>{t('linksText3')}</p>

      <h3>{t('warranties')}</h3>
      <p>{t('warrantiesText1')}</p>
      <p>{t('warrantiesText2')}</p>
      <p>{t('warrantiesText3')}</p>

      <h3>{t('liability')}</h3>
      <p>{t('liabilityText')}</p>

      <h3>{t('parental')}</h3>
      <p>{t('parentalText1')}</p>
      <p>{t('parentalText2')}</p>

      <h3>{t('copyright')}</h3>
      <p>{t('copyrightText1')}</p>
      <p>{t('copyrightNotDo')}</p>
      <ul>
        <li>{t('copyrightItem1')}</li>
        <li>{t('copyrightItem2')}</li>
        <li>{t('copyrightItem3')}</li>
      </ul>
      <p>{t('copyrightText2')}</p>
      <p>{t('copyrightText3')}</p>

      <h3>{t('reliance')}</h3>
      <p>{t('relianceText1')}</p>
      <p>{t('relianceText2')}</p>

      <h3>{t('purchaseNotes')}</h3>
      <p>{t('purchaseNotesText')}</p>

      <h3>{t('confidentiality')}</h3>
      <p>{t('confidentialityText1')}</p>
      <p>{t('confidentialityText2')}</p>

      <h3>{t('indemnity')}</h3>
      <p>{t('indemnityText')}</p>

      <h3>{t('fullAgreement')}</h3>
      <p>{t('fullAgreementText')}</p>

      <h3>{t('modifications')}</h3>
      <p>{t('modificationsText')}</p>

      <p className="legal-updated">{t('updated')}</p>
    </LegalLayout>
  );
}