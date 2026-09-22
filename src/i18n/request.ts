import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async () => {
  // Intentar leer del header del middleware primero
  const headersList = await headers();
  const headerLocale = headersList.get('x-next-locale') as Locale | undefined;

  // Fallback a cookie directa
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  const locale: Locale =
    headerLocale && locales.includes(headerLocale)
      ? headerLocale
      : cookieLocale && locales.includes(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  const baseMessages = (await import(`../locales/${locale}.json`)).default;
  const servicesMessages = (await import(`../locales/services-${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...baseMessages,
      ...servicesMessages,
    },
  };
});