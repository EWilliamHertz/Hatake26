import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'sv'],

  // Used when no locale matches
  defaultLocale: 'sv' // We will default to Swedish!
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Match standard localized paths
    '/(sv|en)/:path*',
    // Catch all other routes to append the locale, but exclude APIs and static files
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
