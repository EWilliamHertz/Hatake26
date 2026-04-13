"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname() || "";
  
  const navLinks = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/orders", label: "Manage Orders", exact: false },
    { href: "/admin/products", label: "All Products", exact: false },
    { href: "/admin/pokemon-cards", label: "Add Pokémon Cards", exact: false },
    { href: "/admin/testimonials", label: "Testimonials", exact: false },
    { href: "/admin/inquiries", label: "Inquiries", exact: false },
    { href: "/admin/users", label: "All Users", exact: false },
  ];

  return (
    <nav className="w-64 bg-slate-100 border-r border-slate-200 p-6 space-y-4 min-h-screen">
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-6">Management</h2>
      {navLinks.map((link) => {
        // Dashboard needs an exact match so it doesn't highlight on every /admin sub-route
        const isActive = link.exact 
          ? (pathname.endsWith("/admin") || pathname.endsWith("/admin/"))
          : pathname.includes(link.href);

        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`block p-2 rounded transition shadow-sm ${
              isActive 
                ? "bg-yellow-400 text-slate-900 font-bold" 
                : "text-slate-700 hover:bg-slate-200 font-medium"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}