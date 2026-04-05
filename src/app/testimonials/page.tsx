import React from 'react';

export default function TestimonialsPage() {
  return (
    <div className="flex-grow bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-slate-900">What Our Customers Say</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-slate-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Johan S.</h4>
                <p className="text-sm text-slate-500">Verified Buyer</p>
              </div>
            </div>
            <p className="text-slate-700 italic leading-relaxed">
              "Hatake KB has the best selection of MTG singles in Sweden. My order arrived perfectly packaged, the grading was spot on, and communication was super smooth."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-slate-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Emma L.</h4>
                <p className="text-sm text-slate-500">Wholesale Partner</p>
              </div>
            </div>
            <p className="text-slate-700 italic leading-relaxed">
              "We source our sealed Pokémon stock from Hatake KB. Fast communication with Ernst and Patricia, and always reliable deliveries. Highly recommend them as a B2B partner!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}