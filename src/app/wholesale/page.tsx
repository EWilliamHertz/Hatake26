"use client";
import React, { useState } from 'react';

// Mock data: In the next step, we will fetch this directly from Prisma
const availableProducts = [
  { id: '1', name: 'Pokémon 151 Booster Bundle', basePrice: 350 },
  { id: '2', name: 'MTG Outlaws of Thunder Junction Play Booster Box', basePrice: 1500 },
];

export default function WholesalePage() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const getDiscountMultiplier = (quantity: number) => {
    if (quantity >= 50) return 0.85; // 15% off
    if (quantity >= 10) return 0.90; // 10% off
    return 1; // No discount
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const product = availableProducts.find(p => p.id === id);
      if (!product) return total;
      return total + (product.basePrice * qty * getDiscountMultiplier(qty));
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const items = Object.entries(cart).map(([id, quantity]) => {
      const product = availableProducts.find(p => p.id === id)!;
      return {
        productId: id,
        name: product.name,
        quantity,
        basePrice: product.basePrice,
        discountedPrice: product.basePrice * getDiscountMultiplier(quantity)
      };
    });

    await fetch('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        message: formData.message,
        totalValue: calculateTotal(),
        items
      })
    });

    setLoading(false);
    alert('Inquiry sent successfully to Ernst and Patricia!');
    setCart({});
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Wholesale Builder</h1>
        <p className="mb-8 text-slate-600">Adjust quantities below. Volume discounts apply automatically.</p>
        
        <div className="mb-8 border-b pb-8">
          {availableProducts.map(product => {
            const qty = cart[product.id] || 0;
            const discount = getDiscountMultiplier(qty);
            return (
              <div key={product.id} className="flex items-center justify-between py-4 border-b last:border-0">
                <div>
                  <h3 className="font-bold text-slate-800">{product.name}</h3>
                  <p className="text-sm text-slate-500">Base: {product.basePrice} SEK</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(product.id, -1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200">-</button>
                    <span className="px-4 font-medium">{qty}</span>
                    <button onClick={() => updateQuantity(product.id, 1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200">+</button>
                  </div>
                  <div className="w-24 text-right">
                    {qty > 0 && <span className="text-green-600 text-sm font-bold ml-2">{(100 - discount * 100).toFixed(0)}% Off</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mt-6 text-right">
            <p className="text-2xl font-bold text-slate-900">Total Value: {calculateTotal().toFixed(2)} SEK</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" required placeholder="Company / Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="block w-full rounded-md border p-3" />
            <input type="email" required placeholder="Contact Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full rounded-md border p-3" />
          </div>
          <textarea rows={3} placeholder="Additional Details" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="block w-full rounded-md border p-3"></textarea>
          <button type="submit" disabled={loading || Object.keys(cart).length === 0} className="w-full bg-slate-900 text-white py-3 px-4 rounded-md font-medium hover:bg-slate-800 disabled:opacity-50">
            {loading ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}