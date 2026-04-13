import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'sv'],

  // Used when no locale matches
  defaultLocale: 'sv' // We will default to Swedish!
});

export const config = {
  matcher: [
    // Match all pathnames except for the ones starting with:
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - static files (e.g. /favicon.ico, /logo.png)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match the root and localized paths
    '/(sv|en)/:path*',
    '/'
  ]
};