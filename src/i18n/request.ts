import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async (params) => {
  return {
    locale: params.locale,
    messages: (await import(`../../messages/${params.locale}.json`)).default
  };
});
