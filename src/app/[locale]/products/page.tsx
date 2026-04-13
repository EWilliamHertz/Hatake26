"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';

function ShopContent() {
  const t = useTranslations('Shop');
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get('productId');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [fullImages, setFullImages] = useState<string[]>([]);

  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        setSelectedProduct(null);
        setCurrentImgIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct]);

  const handleProductClick = async (product: any) => {
    setSelectedProduct(product);
    setCurrentImgIndex(0);
    setFullImages([product.imageUrl]);

    try {
      const res = await fetch(`/api/products/${product.id}`);
      const data = await res.json();
      if (data.images) {
        setFullImages([data.imageUrl, ...data.images]);
      }
    } catch (e) {
      console.error("Gallery load failed");
    }
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        
        if (productIdFromUrl) {
          const targetProduct = data.find((p: any) => p.id === productIdFromUrl);
          if (targetProduct) handleProductClick(targetProduct);
        }
      });
  }, [productIdFromUrl]);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'ALL' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.edition && p.edition.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['ALL', 'POKEMON', 'MTG', 'SEALED', 'MERCHANDISE'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded shadow-sm transition whitespace-nowrap ${filter === cat ? 'bg-slate-800 text-white' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
            >
              {cat === 'ALL' ? t('filterAll') : 
               cat === 'POKEMON' ? 'Pokémon' : 
               cat === 'MTG' ? t('filterMtg') : 
               cat === 'SEALED' ? 'Sealed' : 
               t('merchandise')}
            </button>
          ))}
        </div>
        
        {(filter === 'MTG' || filter === 'POKEMON') && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">{t('singlesDisclaimer')}</p>
          </div>
        )}
        
        {loading ? (
          <p className="text-slate-500">{t('loadingCatalog')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col" onClick={() => handleProductClick(product)}>
                <div className="relative h-56 w-full bg-slate-100 flex-shrink-0 p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-600 text-white font-bold px-3 py-1 rounded">{t('outOfStock')}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-extrabold text-amber-600 text-xl">{product.price.toFixed(2)} SEK</p>
                      <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? t('inStock') : t('outOfStock')}
                      </span>
                    </div>
                    
                    <button 
                      disabled={product.stock === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          imageUrl: product.imageUrl
                        });
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-bold py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {product.stock > 0 ? `+ ${t('addToCart')}` : t('soldOut')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <p className="text-slate-500 col-span-full">{t('noProducts')}</p>}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => { setSelectedProduct(null); setCurrentImgIndex(0); }}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => { setSelectedProduct(null); setCurrentImgIndex(0); }} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 rounded-full p-2 text-slate-800 transition shadow">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="md:w-1/2 bg-slate-100 relative min-h-[400px] flex flex-col">
              <div className="relative flex-grow flex items-center justify-center p-8">
                 {fullImages.length > 1 && (
                   <button onClick={() => setCurrentImgIndex(prev => prev === 0 ? fullImages.length - 1 : prev - 1)} className="absolute left-4 z-10 bg-white/70 hover:bg-white p-2 rounded-full shadow transition">
                     &#8249;
                   </button>
                 )}
                 
                 <img 
                   src={fullImages[currentImgIndex]} 
                   alt={selectedProduct.name} 
                   className="w-full h-full max-h-[400px] object-contain drop-shadow-xl transition-all duration-300" 
                 />

                 {fullImages.length > 1 && (
                   <button onClick={() => setCurrentImgIndex(prev => prev === fullImages.length - 1 ? 0 : prev + 1)} className="absolute right-4 z-10 bg-white/70 hover:bg-white p-2 rounded-full shadow transition">
                     &#8250;
                   </button>
                 )}
              </div>

              {fullImages.length > 1 && (
                <div className="bg-slate-200 p-4 flex gap-3 overflow-x-auto">
                  {fullImages.map((imgUrl: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImgIndex(idx)}
                      onMouseEnter={() => setCurrentImgIndex(idx)} 
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all overflow-hidden bg-white ${currentImgIndex === idx ? 'border-amber-500 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">{selectedProduct.category} {selectedProduct.edition && `• ${selectedProduct.edition}`}</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{selectedProduct.name}</h2>
              <p className="text-4xl font-bold text-amber-600 mb-6">{selectedProduct.price.toFixed(2)} <span className="text-xl text-slate-500">SEK</span></p>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 max-h-48 overflow-y-auto">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedProduct.description || t('noDetails')}
                </p>
              </div>

              {(selectedProduct.category === 'MTG' || selectedProduct.category === 'POKEMON') && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-xs font-medium">{t('singlesDisclaimerDetail')}</p>
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedProduct.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${selectedProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </span>
                  <span className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} ${t('inStock')}` : t('currentlyUnavailable')}
                  </span>
                </div>
                <button 
                  disabled={selectedProduct.stock === 0}
                  onClick={() => {
                    addToCart({
                      id: selectedProduct.id,
                      name: selectedProduct.name,
                      price: selectedProduct.price,
                      imageUrl: selectedProduct.imageUrl
                    });
                  }}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {selectedProduct.stock > 0 ? t('addToCart') : t('outOfStock')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
