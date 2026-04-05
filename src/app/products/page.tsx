import React from 'react';

export default function ProductsPage() {
  return (
    <div className="flex-grow bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">All Products</h1>
        
        {/* Placeholder for future filtering tabs */}
        <div className="flex gap-4 mb-8">
          <button className="bg-slate-800 text-white px-4 py-2 rounded shadow transition">All</button>
          <button className="bg-white border text-slate-700 px-4 py-2 rounded hover:bg-slate-50 transition">MTG Singles</button>
          <button className="bg-white border text-slate-700 px-4 py-2 rounded hover:bg-slate-50 transition">Sealed Pokémon</button>
        </div>
        
        {/* Product Grid Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400">Image</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800">Product Name</h3>
                <p className="text-sm text-slate-500">Edition / Set</p>
                <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}