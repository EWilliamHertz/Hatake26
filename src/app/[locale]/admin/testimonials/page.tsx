"use client";
import React, { useState, useEffect } from 'react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ authorName: "", authorRole: "Verified Buyer", content: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleTraderaSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/testimonials/tradera', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchTestimonials();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (e) {
      alert("Network error during sync.");
    }
    setIsSyncing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setForm({ authorName: "", authorRole: "Verified Buyer", content: "" });
    setEditingId(null);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    }
  };

  const editTestimonial = (t: any) => {
    setEditingId(t.id);
    setForm({ authorName: t.authorName, authorRole: t.authorRole, content: t.content });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Manage Testimonials</h1>
        <button 
          onClick={handleTraderaSync} 
          disabled={isSyncing}
          className="bg-[#0055FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 transition"
        >
          {isSyncing ? "Syncing..." : "🔄 Sync Tradera Reviews"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author Name</label>
              <input type="text" required value={form.authorName} onChange={e => setForm({...form, authorName: e.target.value})} className="w-full border p-2 rounded" placeholder="Johan S." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Author Role (e.g. Tradera Review)</label>
              <input type="text" required value={form.authorRole} onChange={e => setForm({...form, authorRole: e.target.value})} className="w-full border p-2 rounded" placeholder="Verified Buyer" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Review Content</label>
            <textarea required rows={4} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full border p-2 rounded" placeholder="Hatake KB has the best selection..."></textarea>
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ authorName: "", authorRole: "Verified Buyer", content: "" }); }} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
            )}
            <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">{editingId ? "Save Changes" : "Add Testimonial"}</button>
          </div>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-slate-900">Current Testimonials</h2>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
              <div>
                <p className="italic text-slate-700 mb-3">"{t.content}"</p>
                <p className="font-bold text-slate-900">{t.authorName} <span className="font-normal text-slate-500 text-sm ml-2">— {t.authorRole}</span></p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => editTestimonial(t)} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Delete</button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="text-slate-500">No testimonials added yet.</p>}
        </div>
      )}
    </div>
  );
}