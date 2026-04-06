"use client";
import React, { useState, useEffect } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Scryfall Form State
  const [setCode, setSetCode] = useState("");
  const [collectorNumber, setCollectorNumber] = useState("");
  const [fetchingScryfall, setFetchingScryfall] = useState(false);

  // Modal & Manual Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [manualForm, setManualForm] = useState({ name: "", edition: "", description: "", stock: 1, price: 0, category: "SEALED" });
  const [imageFiles, setImageFiles] = useState<{ url: string; file: File }[]>([]);

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
      const res = await fetch(`https://api.scryfall.com/cards/${setCode.toLowerCase()}/${collectorNumber}`);
      if (!res.ok) throw new Error("Card not found");
      const card = await res.json();

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: card.name,
          edition: card.set_name,
          imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
          isSingle: true,
          scryfallId: card.id,
          stock: 1,
          price: 0,
          category: "MTG"
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

  // --- Image Upload Handlers ---
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalAllowed = 20 - imageFiles.length;
      const filesToAdd = filesArray.slice(0, totalAllowed);

      const newImagePreviews = filesToAdd.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));

      setImageFiles(prev => [...prev, ...newImagePreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const convertFileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      alert("Please upload at least one image to serve as the thumbnail.");
      return;
    }

    setIsUploading(true);

    try {
      // Convert all local files to Base64 strings for database storage
      const base64Images = await Promise.all(imageFiles.map(img => convertFileToBase64(img.file)));

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualForm,
          imageUrl: base64Images[0], // First image is the Thumbnail/Hero
          images: base64Images.slice(1), // Remaining images go to the gallery
          isSingle: false,
        })
      });

      // Reset everything after success
      setManualForm({ name: "", edition: "", description: "", stock: 1, price: 0, category: "SEALED" });
      setImageFiles([]);
      setIsModalOpen(false);
      fetchProducts();
      alert("Product added successfully!");
    } catch (error) {
      alert("Failed to upload product. Images might be too large.");
    }
    
    setIsUploading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Manage Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Scryfall Fetcher */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Add MTG Single (Scryfall)</h2>
          <p className="text-sm text-slate-500 mb-4">Automatically fetch Magic cards by their set and collector number.</p>
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

        {/* Manual Addition Trigger */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-2 text-slate-800">General Catalog Manager</h2>
          <p className="text-sm text-slate-500 mb-6">Create fully custom listings for Sealed Pokémon boxes, Binders, Sleeves, and other Merchandise.</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white font-bold py-3 px-8 rounded hover:bg-slate-800 shadow-md transition">
            Open Manual Product Creator
          </button>
        </div>
      </div>

      {/* --- THE LARGE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">Add Merchandise / Sealed Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl px-2">&times;</button>
            </div>
            
            <form onSubmit={handleManualSubmit} className="p-6 space-y-8">
              
              {/* Product Basics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Title</label>
                  <p className="text-xs text-slate-500 mb-2">The main name displayed to customers.</p>
                  <input type="text" required placeholder="e.g., Pokémon 151 Elite Trainer Box" value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <p className="text-xs text-slate-500 mb-2">Used to filter items in the shop catalog.</p>
                  <select value={manualForm.category} onChange={e => setManualForm({...manualForm, category: e.target.value})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white">
                    <option value="SEALED">Sealed Pokémon Product</option>
                    <option value="MERCHANDISE">General Merchandise (Sleeves, Binders)</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price (SEK)</label>
                  <p className="text-xs text-slate-500 mb-2">Base price for checkout.</p>
                  <input type="number" required min="0" placeholder="599" value={manualForm.price} onChange={e => setManualForm({...manualForm, price: Number(e.target.value)})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Initial Stock</label>
                  <p className="text-xs text-slate-500 mb-2">How many items are in the warehouse.</p>
                  <input type="number" required min="0" value={manualForm.stock} onChange={e => setManualForm({...manualForm, stock: Number(e.target.value)})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Edition (Optional)</label>
                  <p className="text-xs text-slate-500 mb-2">E.g., "Scarlet & Violet", "2024".</p>
                  <input type="text" placeholder="Edition / Year" value={manualForm.edition} onChange={e => setManualForm({...manualForm, edition: e.target.value})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Description (Optional)</label>
                <p className="text-xs text-slate-500 mb-2">Write any condition notes, bundle contents, or marketing text here.</p>
                <textarea rows={3} value={manualForm.description} onChange={e => setManualForm({...manualForm, description: e.target.value})} className="w-full border p-3 rounded bg-slate-50 focus:bg-white"></textarea>
              </div>

              {/* Image Uploader */}
              <div className="bg-slate-50 p-6 rounded border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Images (Up to 20)</label>
                <p className="text-xs text-slate-500 mb-4">Upload pictures from your computer. <strong className="text-slate-800">The first picture uploaded will automatically be the Primary Thumbnail and Hero Slideshow image!</strong></p>
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileSelection} 
                  disabled={imageFiles.length >= 20}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />

                {/* Image Previews */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                    {imageFiles.map((img, index) => (
                      <div key={index} className="relative group rounded overflow-hidden border border-slate-300 aspect-square">
                        <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white text-[10px] font-bold text-center py-1">
                            THUMBNAIL
                          </div>
                        )}
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded transition">Cancel</button>
                <button type="submit" disabled={isUploading} className="bg-green-600 text-white font-bold py-3 px-8 rounded hover:bg-green-700 transition shadow-md disabled:opacity-50">
                  {isUploading ? "Uploading Data & Images..." : "Save Product to Catalog"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Current Inventory</h2>
      {loading ? <p>Loading products...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium text-slate-600">Image</th>
                <th className="p-4 font-medium text-slate-600">Name</th>
                <th className="p-4 font-medium text-slate-600">Price</th>
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
                  <td className="p-4 text-slate-600">{product.price} SEK</td>
                  <td className="p-4 text-slate-600">
                    <span className={`px-2 py-1 text-xs rounded-full ${product.isSingle ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {product.category}
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