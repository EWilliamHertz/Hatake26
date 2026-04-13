'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  images: string[];
  category: string; // Updated to string to prevent TS errors
  price: number;
  stock: number;
  isSingle?: boolean;
  tcgdexId?: string;
  setCode?: string;
}

// Main Carousel Component (For Sealed & Merchandise ONLY)
function MainCarousel({ products }: { products: Product[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const t = useTranslations();
  const pathname = usePathname() || '';
  const currentLocale = pathname.split('/')[1] || 'sv';

  // Filter out MTG and POKEMON to keep this exclusive to generic/sealed products
  const filteredProducts = products.filter(p => p.category !== 'MTG' && p.category !== 'POKEMON');

  useEffect(() => {
    if (!isAutoPlay || filteredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredProducts.length]);

  if (filteredProducts.length === 0) {
    return (
      <header className="relative w-full h-[60vh] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden flex items-center justify-center">
        <div className="relative z-10 text-center text-white p-8">
          <Image 
            src="/logo.png" 
            alt="Hatake KB Logo" 
            width={96} 
            height={96} 
            className="mb-6 rounded-xl shadow-lg border-2 border-slate-700 mx-auto"
          />
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Hatake KB</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your premium source for Trading Card Games and Merchandise.
          </p>
        </div>
      </header>
    );
  }

  const product = filteredProducts[currentSlide];

  return (
    <header className="relative w-full h-[60vh] bg-slate-900 overflow-hidden flex items-center justify-center">
      {product?.imageUrl && (
        <div className="absolute inset-0">
          <img src={product.imageUrl} alt="" className="w-full h-full object-cover opacity-20 blur-3xl" />
        </div>
      )}
      
      {product?.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8 md:p-16">
          <div className="absolute w-64 h-64 md:w-[400px] md:h-[400px] bg-white rounded-full blur-[80px] opacity-70"></div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative w-full h-full max-w-md md:max-w-lg object-contain drop-shadow-2xl opacity-95 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          />
        </div>
      )}

      <div className="relative z-10 text-center text-white p-8 max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">{product?.name}</h1>
        <p className="text-xl mb-8 text-slate-200 drop-shadow-md">{product?.category}</p>
        <p className="text-4xl font-bold text-amber-400 mb-8 drop-shadow-md">{Number(product?.price || 0).toFixed(2)} SEK</p>
        <Link
          href={`/${currentLocale}/products?productId=${product?.id}`}
          className="inline-block bg-amber-600 hover:bg-amber-500 text-slate-900 font-extrabold py-3 px-8 rounded-lg transition shadow-[0_0_15px_rgba(217,119,6,0.5)] hover:shadow-[0_0_25px_rgba(217,119,6,0.8)]"
        >
          {t('Shop.addToCart')}
        </Link>
      </div>

      <button
        onClick={() => {
          setIsAutoPlay(false);
          setCurrentSlide(prev => (prev - 1 + filteredProducts.length) % filteredProducts.length);
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        &#8249;
      </button>
      <button
        onClick={() => {
          setIsAutoPlay(false);
          setCurrentSlide(prev => (prev + 1) % filteredProducts.length);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        &#8250;
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {filteredProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setIsAutoPlay(false); setCurrentSlide(idx); }}
            className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-amber-600' : 'bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>
      <div onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)} className="absolute inset-0 z-5" />
    </header>
  );
}

// NEW: Pokemon Exclusive Hero Carousel
function PokemonHeroCarousel({ products }: { products: Product[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const t = useTranslations();
  const pathname = usePathname() || '';
  const currentLocale = pathname.split('/')[1] || 'sv';

  const filteredProducts = products.filter(p => p.category === 'POKEMON');

  useEffect(() => {
    if (!isAutoPlay || filteredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filteredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredProducts.length]);

  if (filteredProducts.length === 0) return null;

  const product = filteredProducts[currentSlide];

  return (
    <section className="relative w-full h-[60vh] bg-gradient-to-r from-red-900 to-slate-900 overflow-hidden flex items-center justify-center border-t border-slate-800">
      {product?.imageUrl && (
        <div className="absolute inset-0">
          <img src={product.imageUrl} alt="" className="w-full h-full object-cover opacity-30 blur-3xl" />
        </div>
      )}
      
      {product?.imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8 md:p-16">
          <div className="absolute w-64 h-64 md:w-[400px] md:h-[400px] bg-white rounded-full blur-[80px] opacity-70"></div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative w-full h-full max-w-md md:max-w-lg object-contain drop-shadow-2xl opacity-95 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          />
        </div>
      )}

      <div className="relative z-10 text-center text-white p-8 max-w-2xl">
        <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">Premium Pokémon Singles</p>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">{product?.name}</h1>
        <p className="text-xl mb-8 text-slate-200 drop-shadow-md">{product?.setCode || 'POKEMON TCG'}</p>
        <p className="text-4xl font-bold text-amber-400 mb-8 drop-shadow-md">{Number(product?.price || 0).toFixed(2)} SEK</p>
        <Link
          href={`/${currentLocale}/products?productId=${product?.id}`}
          className="inline-block bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 px-8 rounded-lg transition shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]"
        >
          {t('Shop.addToCart')}
        </Link>
      </div>

      <button onClick={() => { setIsAutoPlay(false); setCurrentSlide(prev => (prev - 1 + filteredProducts.length) % filteredProducts.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors">
        &#8249;
      </button>
      <button onClick={() => { setIsAutoPlay(false); setCurrentSlide(prev => (prev + 1) % filteredProducts.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors">
        &#8250;
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {filteredProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setIsAutoPlay(false); setCurrentSlide(idx); }}
            className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-red-500' : 'bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>
      <div onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)} className="absolute inset-0 z-5" />
    </section>
  );
}

// Featured Products Grid
function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations();
  const pathname = usePathname() || '';
  const currentLocale = pathname.split('/')[1] || 'sv';

  const featured = products
    .filter(p => p.stock > 0)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">{t('Common.featuredProducts')}</h2>
        <p className="text-slate-600 mb-12">{t('Common.featuredSubtitle')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(product => (
            <Link key={product.id} href={`/${currentLocale}/products?productId=${product.id}`}>
              <div className="bg-slate-50 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full flex flex-col">
                <div className="relative h-64 w-full bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">{product.category}</p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                    <p className="text-2xl font-bold text-amber-600">{Number(product.price || 0).toFixed(2)} SEK</p>
                    <span className="text-sm font-semibold text-green-600">In Stock</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();
  const pathname = usePathname() || '';
  const currentLocale = pathname.split('/')[1] || 'sv';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', { headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* 1. Main Generic/Sealed Carousel */}
      {loading ? (
        <div className="w-full h-[60vh] bg-slate-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-amber-600 mx-auto mb-4"></div>
            <p>{t('Common.loading')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-[60vh] bg-red-50 flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-red-600 font-semibold mb-2 text-lg">{t('Common.error')}</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
          </div>
        </div>
      ) : (
        <MainCarousel products={products} />
      )}

      {/* 2. Pokemon Exclusive Hero Carousel */}
      {!loading && !error && <PokemonHeroCarousel products={products} />}

      {/* 3. Featured Products Grid */}
      {!loading && !error && <FeaturedProducts products={products} />}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Explore All Products</h2>
          <Link
            href={`/${currentLocale}/products`}
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View Full Catalog
          </Link>
        </div>

        {/* CTA to About Us */}
        <div className="mt-16 p-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">{t('About.narrative')}</h3>
          <Link
            href={`/${currentLocale}/about`}
            className="inline-block bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {t('Navigation.about')}
          </Link>
        </div>
      </main>

      {/* Company Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Hatake KB Logo" width={32} height={32} className="rounded-md" />
                <h3 className="text-white text-xl font-bold">Hatake KB</h3>
              </div>
              <p>Fabriksgatan 36</p>
              <p>272 36 Simrishamn, Sweden</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Business Info</h3>
              <p><strong>Organisationsnummer:</strong></p>
              <p>969803-0583</p>
              <p className="mt-3"><strong>VAT Nummer:</strong></p>
              <p>SE969803058301</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">{t('Footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li><Link href={`/${currentLocale}/products`} className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href={`/${currentLocale}`} className="hover:text-white transition-colors">{t('Navigation.home')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Hatake KB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}