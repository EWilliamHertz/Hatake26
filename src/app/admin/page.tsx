import React from 'react';
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const productCount = await prisma.product.count();
  const inquiryCount = await prisma.inquiry.count();
  const userCount = await prisma.user.count();

  // Financial Calculator: Fetch all products and multiply Price * Stock
  const products = await prisma.product.findMany({
    select: { price: true, stock: true }
  });
  
  const grossStockValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const netStockValue = grossStockValue * 0.75; // Reduces by 25% for MOMS

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-slate-900">Admin Dashboard</h1>
      
      {/* Financial Overview Card */}
      <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-1">Total Inventory Value (Gross)</p>
          <p className="text-4xl font-extrabold mb-2">{grossStockValue.toLocaleString('sv-SE')} SEK</p>
          <p className="text-sm text-slate-400">Total value of all physical items currently in stock.</p>
        </div>
        <div className="md:text-right md:border-l md:border-slate-700 md:pl-8">
          <p className="text-sm font-bold text-green-400 uppercase tracking-widest mb-1">Value after 25% MOMS Deduction</p>
          <p className="text-4xl font-extrabold mb-2">{netStockValue.toLocaleString('sv-SE')} SEK</p>
          <p className="text-sm text-slate-400">Net value assuming standard 25% Swedish VAT.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Stat Card: Products */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Total Products</p>
          <p className="text-5xl font-extrabold text-slate-900">{productCount}</p>
          <Link href="/admin/products" className="block mt-4 text-sm text-slate-600 hover:text-slate-900 transition">Manage Products →</Link>
        </div>

        {/* Stat Card: Inquiries */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Pending Inquiries</p>
          <p className="text-5xl font-extrabold text-slate-900">{inquiryCount}</p>
          <Link href="/admin/inquiries" className="block mt-4 text-sm text-slate-600 hover:text-slate-900 transition">Review Inquiries →</Link>
        </div>

        {/* Stat Card: Users */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Total Users</p>
          <p className="text-5xl font-extrabold text-slate-900">{userCount}</p>
          <Link href="/admin/users" className="block mt-4 text-sm text-slate-600 hover:text-slate-900 transition">Manage Admins →</Link>
        </div>

      </div>
    </div>
  );
}