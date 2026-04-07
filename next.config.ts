import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['3000-cs-553118797525-default.cs-europe-west4-pear.cloudshell.dev'],
};

export default withNextIntl(nextConfig);
