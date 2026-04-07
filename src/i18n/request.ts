import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'sv'];

export default getRequestConfig(async (params) => {
  // Satisfy TypeScript by providing a strict fallback if undefined
  const locale = params.locale || 'sv';

  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});