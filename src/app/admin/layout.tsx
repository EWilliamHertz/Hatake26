import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pass authOptions so the server can read your custom 'role' property
  const session = await getServerSession(authOptions);
  
  // Security Redirect: Strictly block anyone who is not an admin
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/"); 
  }

  return (
    <div className="flex flex-grow min-h-full">
      {/* Admin Sidebar */}
      <nav className="w-64 bg-slate-100 border-r border-slate-200 p-6 space-y-4 min-h-screen">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-6">Management</h2>
        <Link href="/admin" className="block text-slate-900 font-medium p-2 rounded hover:bg-slate-200 transition">Dashboard</Link>
        <Link href="/admin/orders" className="block text-slate-900 font-bold bg-yellow-400 p-2 rounded shadow-sm transition">Manage Orders</Link>
        <Link href="/admin/products" className="block text-slate-700 p-2 rounded hover:bg-slate-200 transition">All Products</Link>
        <Link href="/admin/testimonials" className="block text-slate-700 p-2 rounded hover:bg-slate-200 transition">Testimonials</Link>
        <Link href="/admin/inquiries" className="block text-slate-700 p-2 rounded hover:bg-slate-200 transition">Inquiries</Link>
        <Link href="/admin/users" className="block text-slate-700 p-2 rounded hover:bg-slate-200 transition">All Users</Link>
      </nav>
      {/* Main Admin Content */}
      <main className="flex-grow p-10 bg-slate-50">
        {children}
      </main>
    </div>
  );
}