     "use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function WholesalePage() {
  const t = useTranslations("Wholesale");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const wholesaleItems = data.filter((p: any) => p.category !== "MTG");
        setProducts(wholesaleItems);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[productId];
      else newCart[productId] = next;
      return newCart;
    });
  };

  const totalValue = Object.entries(cart).reduce((total, [id, qty]) => {
    const p = products.find((prod) => prod.id === id);
    return total + (p ? p.price * qty : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalValue === 0) return alert(t('emptyCart'));
    
    setSubmitting(true);
    try {
      const itemsList = Object.entries(cart).map(([id, qty]) => {
        const p = products.find((prod) => prod.id === id);
        return { productId: id, name: p?.name, quantity: qty, unitPrice: p?.price };
      });

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, customerEmail: email, message, items: itemsList, totalValue }),
      });

      if (res.ok) setSuccess(true);
      else alert("Failed to submit inquiry.");
    } catch (error) {
      alert("Network error.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('successTitle')}</h2>
          <p className="text-slate-600 mb-8">{t('successMessage')}</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 font-bold hover:underline">{t('submitAnother')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Product List */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('title')}</h1>
          <p className="text-slate-600 mb-6">{t('subtitle')}</p>
          
          {loading ? (
            <p className="text-slate-500">{t('loadingCatalog')}</p>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {products.map((product) => {
                const qty = cart[product.id] || 0;
                return (
                  <div key={product.id} className="flex items-center p-4 border-b border-slate-100 hover:bg-slate-50 transition">
                    <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center mr-4 flex-shrink-0 p-1">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400">{t('noImage')}</span>
                      )}
                    </div>
                    <div className="flex-grow pr-4">
                      <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
                      <p className="text-slate-500 text-sm">{t('retail')}: {product.price.toFixed(2)} SEK | {t('stock')}: {product.stock}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => updateQuantity(product.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded text-slate-600 hover:bg-slate-200 transition font-bold shadow-sm">-</button>
                      <span className="w-6 text-center font-bold text-slate-900">{qty}</span>
                      <button onClick={() => updateQuantity(product.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded text-slate-600 hover:bg-slate-200 transition font-bold shadow-sm">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Submission Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{t('summaryTitle')}</h2>
            <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">{t('itemsSelected')}</span>
                <span className="font-bold text-slate-900">{Object.values(cart).reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-lg border-t pt-2 mt-2">
                <span className="text-slate-800 font-bold">{t('estimatedValue')}:</span>
                <span className="font-extrabold text-amber-600">{totalValue.toFixed(2)} SEK</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 italic text-right">{t('discountNote')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('companyLabel')}</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" placeholder={t('companyPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('emailLabel')}</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" placeholder={t('emailPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('notesLabel')}</label>
                <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" placeholder={t('notesPlaceholder')}></textarea>
              </div>
              
              <button type="submit" disabled={submitting || totalValue === 0} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 shadow-md">
                {submitting ? t('submittingBtn') : t('submitBtn')}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}