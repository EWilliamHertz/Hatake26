"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get('productId');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        
        // Auto-open modal if URL parameter exists
        if (productIdFromUrl) {
          const targetProduct = data.find((p: any) => p.id === productIdFromUrl);
          if (targetProduct) setSelectedProduct(targetProduct);
        }
      });
  }, [productIdFromUrl]);

  const filteredProducts = products.filter(p => {
    if (filter === 'ALL') return true;
    return p.category === filter;
  });

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">All Products</h1>
        
        {/* Filtering Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['ALL', 'MTG', 'SEALED', 'MERCHANDISE'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded shadow-sm transition whitespace-nowrap ${filter === cat ? 'bg-slate-800 text-white' : 'bg-white border text-slate-700 hover:bg-slate-100'}`}
            >
              {cat === 'ALL' ? 'All Products' : cat === 'MTG' ? 'MTG Singles' : cat === 'SEALED' ? 'Sealed Pokémon' : 'Merchandise'}
            </button>
          ))}
        </div>
        
        {/* Real Product Grid */}
        {loading ? (
          <p className="text-slate-500">Loading catalog...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col" onClick={() => setSelectedProduct(product)}>
                <div className="relative h-56 bg-slate-100 flex items-center justify-center p-4">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-2" />
                  ) : (
                    <span className="text-slate-400">No Image</span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-600 text-white font-bold px-3 py-1 rounded">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="font-extrabold text-amber-600 text-xl">{product.price.toFixed(2)} SEK</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <p className="text-slate-500 col-span-full">No products found in this category.</p>}
          </div>
        )}
      </div>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white rounded-full p-2 text-slate-800 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            {/* Image Section */}
            <div className="md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-[500px] p-8 flex items-center justify-center">
               {selectedProduct.imageUrl && (
                 <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-contain p-4 drop-shadow-xl" />
               )}
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">{selectedProduct.category} {selectedProduct.edition && `• ${selectedProduct.edition}`}</p>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{selectedProduct.name}</h2>
              <p className="text-4xl font-bold text-amber-600 mb-6">{selectedProduct.price.toFixed(2)} <span className="text-xl text-slate-500">SEK</span></p>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedProduct.description || "No specific details provided for this item."}
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${selectedProduct.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${selectedProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </span>
                  <span className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} In Stock` : 'Currently Unavailable'}
                  </span>
                </div>
                <button 
                  disabled={selectedProduct.stock === 0}
                  onClick={() => alert(`Added ${selectedProduct.name} to cart!`)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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