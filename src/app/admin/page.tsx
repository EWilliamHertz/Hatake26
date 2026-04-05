import React from 'react';
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function AdminDashboardPage() {
  // Query NeonDB for counts (Server Component)
  const productCount = await prisma.product.count();
  const inquiryCount = await prisma.inquiry.count();
  const userCount = await prisma.user.count();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-slate-900">Admin Dashboard</h1>
      
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