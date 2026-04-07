'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function About() {
  const t = useTranslations('About');
  const tNav = useTranslations('Navigation');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] as string;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">{t('title')}</h1>
          <p className="text-2xl text-amber-400 mb-6 drop-shadow-md">{t('tagline')}</p>
          <p className="text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            {t('narrative')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">{t('mission')}</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                {t('missionText')}
              </p>
              <p className="text-slate-600">
                We believe in quality over quantity, and every product we offer is carefully curated 
                to meet the highest standards of authenticity and condition. Whether you're a seasoned 
                collector or just starting your journey into trading cards and premium merchandise, 
                we're here to support your passion.
              </p>
            </div>
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg opacity-20"></div>
              <div className="relative h-full bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <p>Curated Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">{t('team')}</h2>
            <p className="text-xl text-slate-600">{t('teamDescription')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Phoebe Card */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src="https://i.imgur.com/HrhKBOY.jpeg"
                  alt="Phoebe"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Phoebe</h3>
              <p className="text-slate-600 mb-4">Founder & Creative Director</p>
              <p className="text-slate-500 max-w-xs">
                Passionate about bringing together the worlds of high-end commerce and artistic excellence. 
                Dedicated to curating the finest collections for discerning collectors worldwide.
              </p>
            </div>

            {/* Placeholder Team Members */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <svg className="w-32 h-32 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
              <p className="text-slate-600 mb-4">Team Member</p>
              <p className="text-slate-500 max-w-xs">
                We're expanding our team with passionate individuals who share our commitment to excellence.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                <svg className="w-32 h-32 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
              <p className="text-slate-600 mb-4">Team Member</p>
              <p className="text-slate-500 max-w-xs">
                We're expanding our team with passionate individuals who share our commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-slate-900">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Quality</h3>
              <p className="text-slate-600">
                Every product is carefully examined and authenticated to ensure the highest standards.
              </p>
            </div>

            {/* Integrity */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Integrity</h3>
              <p className="text-slate-600">
                Transparent communication and honest dealings form the foundation of our business.
              </p>
            </div>

            {/* Passion */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Passion</h3>
              <p className="text-slate-600">
                We're driven by genuine love for collecting and the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('joinCta')}</h2>
          <p className="text-xl text-slate-200 mb-8">{t('exploreCta')}</p>
          <Link
            href={`/${currentLocale}/products`}
            className="inline-block bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold py-4 px-12 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            {tNav('products')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Hatake KB Logo" width={32} height={32} className="rounded-md" />
                <h3 className="text-white text-xl font-bold">Hatake KB</h3>
              </div>
              <p>Premium trading cards and merchandise</p>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href={`/${currentLocale}`} className="hover:text-white transition-colors">{tNav('home')}</Link></li>
                <li><Link href={`/${currentLocale}/products`} className="hover:text-white transition-colors">{tNav('products')}</Link></li>
                <li><Link href={`/${currentLocale}/about`} className="hover:text-white transition-colors">{tNav('about')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
              <p>Fabriksgatan 36</p>
              <p>272 36 Simrishamn, Sweden</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 Hatake KB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
