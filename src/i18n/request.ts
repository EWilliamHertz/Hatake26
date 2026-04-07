import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'sv'];

export default getRequestConfig(async ({ requestLocale }) => {
  // In Next 15 / next-intl v3.22+, requestLocale is a Promise
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as string)) {
    locale = 'sv';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});