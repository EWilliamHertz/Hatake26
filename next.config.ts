import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['3000-cs-553118797525-default.cs-europe-west4-pear.cloudshell.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tcgdex.net',
      },
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'hatake.eu',
      },
      {
        protocol: 'https',
        hostname: 'www.hatake.eu',
      }
    ],
  },
};

export default withNextIntl(nextConfig);
