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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Image 
              src="/logo.png" 
              alt="Hatake Logo" 
              width={100} 
              height={100} 
              className="rounded-2xl shadow-sm border border-slate-200"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 mb-6 uppercase tracking-wider font-medium">
            <span>{t('subtitle')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">{t('title')}</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.bulkImport')}</h3>
            <p className="text-slate-500 leading-relaxed">{t('features.bulkImportDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.euDispatch')}</h3>
            <p className="text-slate-500 leading-relaxed">{t('features.euDispatchDesc')}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('features.creditLine')}</h3>
            <p className="text-slate-500 leading-relaxed">{t('features.creditLineDesc')}</p>
          </div>
        </div>
      </section>

      {/* Building Section */}
      <section className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">{t('building.title')}</h2>
          
          <div className="space-y-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">{t('building.social')}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('building.socialDesc')}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">{t('building.shops')}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('building.shopsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('vision.title')}</h2>
          <p className="text-xl text-slate-600 leading-relaxed italic">
            "{t('vision.text')}"
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-slate-900 text-white rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('team.title')}</h2>
            <p className="text-xl text-slate-400">{t('team.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Ernst-William */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src="/team/ernst.jpeg"
                  alt="Ernst-William Hertz"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{t('team.ernst.name')}</h3>
              <p className="text-amber-500 font-medium uppercase tracking-wider text-sm">{t('team.ernst.role')}</p>
              <p className="text-slate-400 leading-relaxed">{t('team.ernst.desc')}</p>
            </div>

            {/* Patricia */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src="/team/patricia.jpeg"
                  alt="Patricia Andersson"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{t('team.patricia.name')}</h3>
              <p className="text-amber-500 font-medium uppercase tracking-wider text-sm">{t('team.patricia.role')}</p>
              <p className="text-slate-400 leading-relaxed">{t('team.patricia.desc')}</p>
            </div>

            {/* Mark */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src="/team/mark.jpeg"
                  alt="Mark Lange Jensen"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{t('team.mark.name')}</h3>
              <p className="text-amber-500 font-medium uppercase tracking-wider text-sm">{t('team.mark.role')}</p>
              <p className="text-slate-400 leading-relaxed">{t('team.mark.desc')}</p>
            </div>

            {/* Virre */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src="/team/virre.jpeg"
                  alt="Virre Van Zarate Abreu"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{t('team.virre.name')}</h3>
              <p className="text-amber-500 font-medium uppercase tracking-wider text-sm">{t('team.virre.role')}</p>
              <p className="text-slate-400 leading-relaxed">{t('team.virre.desc')}</p>
            </div>

            {/* Phoebe */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                <Image
                  src="/team/phoebe.jpeg"
                  alt="Phoebe Wang"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold">{t('team.phoebe.name')}</h3>
              <p className="text-amber-500 font-medium uppercase tracking-wider text-sm">{t('team.phoebe.role')}</p>
              <p className="text-slate-400 leading-relaxed">{t('team.phoebe.desc')}</p>
            </div>
          </div>
          </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-4 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t('contact.title')}</h2>
          <p className="text-xl text-slate-400 mb-10">{t('contact.text')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href={`/${currentLocale}/products`}
              className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors"
            >
              {tNav('products')}
            </Link>
            <Link
              href={`/${currentLocale}/wholesale`}
              className="border border-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors"
            >
              {tNav('wholesale')}
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 px-4 bg-slate-950 text-slate-500 text-center text-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-8">
            <Link href={`/${currentLocale}`} className="hover:text-white transition-colors">{tNav('home')}</Link>
            <Link href={`/${currentLocale}/products`} className="hover:text-white transition-colors">{tNav('products')}</Link>
            <Link href={`/${currentLocale}/about`} className="hover:text-white transition-colors">{tNav('about')}</Link>
          </div>
          <p>© 2024 Hatake KB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
