"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Scryfall Form State
  const [setCode, setSetCode] = useState("");
  const [collectorNumber, setCollectorNumber] = useState("");
  const [fetchingScryfall, setFetchingScryfall] = useState(false);

  // Manual Form State (Pokémon)
  const [manualForm, setManualForm] = useState({ name: "", edition: "", imageUrl: "", stock: 1 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleScryfallFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFetchingScryfall(true);
    try {
      // Scryfall API Call: https://api.scryfall.com/cards/{set}/{number}
      const res = await fetch(`https://api.scryfall.com/cards/${setCode.toLowerCase()}/${collectorNumber}`);
      if (!res.ok) throw new Error("Card not found");
      const card = await res.json();

      // Save to NeonDB
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: card.name,
          edition: card.set_name,
          imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
          isSingle: true,
          scryfallId: card.id,
          stock: 1, // Default 1
        })
      });

      setSetCode("");
      setCollectorNumber("");
      fetchProducts();
      alert(`Successfully added ${card.name}!`);
    } catch (error) {
      alert("Failed to find card on Scryfall. Check Set Code and Number.");
    }
    setFetchingScryfall(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...manualForm,
        isSingle: false,
      })
    });
    setManualForm({ name: "", edition: "", imageUrl: "", stock: 1 });
    fetchProducts();
    alert("Product added successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Manage Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Scryfall Fetcher */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Add MTG Single (Scryfall)</h2>
          <form onSubmit={handleScryfallFetch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">Set Code (e.g., m21)</label>
                <input type="text" required value={setCode} onChange={e => setSetCode(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">Collector # (e.g., 1)</label>
                <input type="text" required value={collectorNumber} onChange={e => setCollectorNumber(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            </div>
            <button type="submit" disabled={fetchingScryfall} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {fetchingScryfall ? "Fetching..." : "Fetch & Add Card"}
            </button>
          </form>
        </div>

        {/* Manual Addition (Sealed / Pokémon) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Add Sealed / Pokémon Product</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="Product Name" required value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} className="w-full border p-2 rounded flex-2" />
              <input type="text" placeholder="Edition / Set" value={manualForm.edition} onChange={e => setManualForm({...manualForm, edition: e.target.value})} className="w-full border p-2 rounded flex-1" />
            </div>
            <div className="flex gap-4">
              <input type="url" placeholder="Image URL (Imgur, etc.)" required value={manualForm.imageUrl} onChange={e => setManualForm({...manualForm, imageUrl: e.target.value})} className="w-full border p-2 rounded flex-2" />
              <input type="number" placeholder="Stock" min="0" required value={manualForm.stock} onChange={e => setManualForm({...manualForm, stock: Number(e.target.value)})} className="w-full border p-2 rounded flex-1" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800">
              Add Manual Product
            </button>
          </form>
        </div>
      </div>

      {/* Inventory List */}
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Current Inventory</h2>
      {loading ? <p>Loading products...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium text-slate-600">Image</th>
                <th className="p-4 font-medium text-slate-600">Name</th>
                <th className="p-4 font-medium text-slate-600">Edition</th>
                <th className="p-4 font-medium text-slate-600">Type</th>
                <th className="p-4 font-medium text-slate-600">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-12 h-16 object-cover rounded shadow-sm" />}
                  </td>
                  <td className="p-4 font-medium text-slate-900">{product.name}</td>
                  <td className="p-4 text-slate-600">{product.edition || "-"}</td>
                  <td className="p-4 text-slate-600">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.isSingle ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {product.isSingle ? 'MTG Single' : 'Sealed'}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{product.stock}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No products found. Start adding some above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}