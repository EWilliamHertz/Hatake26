"use client";
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Testimonials');

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex-grow bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-slate-900">{t('title')}</h1>
        
        {loading ? (
          <p className="text-center text-slate-500">{t('loading')}</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-slate-500">{t('none')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center mb-6">
                  {/* Avatar Placeholder */}
                  <div className="h-12 w-12 bg-slate-300 rounded-full mr-4 flex items-center justify-center text-slate-500 font-bold uppercase">
                    {t.authorName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{t.authorName}</h4>
                    <p className="text-sm text-slate-500">{t.authorRole}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
