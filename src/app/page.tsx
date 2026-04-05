import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Big Hero Slider Placeholder */}
      <header className="relative w-full h-[60vh] bg-slate-800 overflow-hidden flex items-center justify-center">
        {/* In the future, we will map through database images here */}
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1611996575749-79a3a250f563?q=80&w=2000')] bg-cover bg-center animate-pulse" />
        <div className="relative z-10 text-center text-white p-8 flex flex-col items-center">
          {/* Using Next.js Image for strict, unbreakable sizing */}
          <Image src="/logo.png" alt="Hatake KB Logo" width={96} height={96} className="mb-6 rounded-xl shadow-lg border-2 border-slate-700" />
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Hatake KB</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your premium source for Magic: The Gathering singles and Sealed Pokémon products.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* We will fetch and display products from NeonDB here later */}
          <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <p className="text-slate-500">Product Grid (Loading from DB...)</p>
          </div>
          <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <p className="text-slate-500">Product Grid (Loading from DB...)</p>
          </div>
          <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <p className="text-slate-500">Product Grid (Loading from DB...)</p>
          </div>
        </div>
      </main>

      {/* Company Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Hatake KB Logo" width={32} height={32} className="rounded-md" />
              <h3 className="text-white text-xl font-bold">Hatake KB</h3>
            </div>
            <p>Fabriksgatan 36</p>
            <p>272 36 Simrishamn, Sweden</p>
            <p className="mt-4"><strong>Organisationsnummer:</strong> <span>969803-0583</span></p>
            <p><strong>VAT Nummer:</strong> <span>SE969803058301</span></p>
            <p><strong>EORI Nummer:</strong> <span>SE 9698030583</span></p>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Contact & Payment</h3>
            <p><strong>Swish:</strong> <span>123-587 57 37</span></p>
            <div className="mt-4">
              <p><strong>Admin Contact:</strong></p>
              <a href="mailto:ernst@hatake.eu" className="block hover:text-white transition">ernst@hatake.eu</a>
              <a href="mailto:patricia@hatake.eu" className="block hover:text-white transition">patricia@hatake.eu</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}