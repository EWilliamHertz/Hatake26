"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/CartDrawer";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const pathname = usePathname() || "";

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "sv";

  // Connect navigation to our Zustand store
  const { items, toggleCart } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to switch locale
  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|sv)/, "");
    return `/${newLocale}${pathWithoutLocale || ""}`;
  };

  return (
    <>
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href={`/${currentLocale}`} className="flex items-center gap-2 mr-4">
              <Image
                src="/logo.png"
                alt="Hatake KB Logo"
                width={72}
                height={72}
                className="rounded-md"
              />
              <span className="text-2xl font-bold tracking-tight hidden sm:block">
                Hatake KB
              </span>
            </Link>
            <div className="space-x-6 text-sm font-medium hidden md:block">
              <Link href={`/${currentLocale}`} className="hover:text-slate-300 transition">
                {t("home")}
              </Link>
              <Link href={`/${currentLocale}/products`} className="hover:text-slate-300 transition">
                {t("products")}
              </Link>
              <Link href={`/${currentLocale}/wholesale`} className="hover:text-slate-300 transition">
                {t("wholesale")}
              </Link>
              <Link href={`/${currentLocale}/testimonials`} className="hover:text-slate-300 transition">
                {t("testimonials")}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm font-medium">
            {/* Language Switcher */}
            <div className="flex gap-2">
              <Link
                href={switchLocale("en")}
                className={`text-xl transition ${
                  currentLocale === "en"
                    ? "opacity-100 font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
                title="English"
              >
                🇬🇧
              </Link>
              <Link
                href={switchLocale("sv")}
                className={`text-xl transition ${
                  currentLocale === "sv"
                    ? "opacity-100 font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
                title="Svenska"
              >
                🇸🇪
              </Link>
            </div>

            {/* The Cart Button */}
            <button
              onClick={toggleCart}
              className="relative hover:text-amber-400 transition md:mr-4"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>

            {status === "loading" ? (
              <span className="text-slate-500 hidden md:block">...</span>
            ) : session ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-slate-300 mr-2 truncate max-w-[150px]">
                  {t("hello", { email: session.user?.email || "" })}
                </span>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="bg-yellow-500 text-slate-900 px-4 py-1 rounded font-bold hover:bg-yellow-400 transition shadow-sm"
                  >
                    {t("admin")}
                  </Link>
                ) : (
                  <Link
                    href={`/${currentLocale}/dashboard`}
                    className="bg-blue-600 text-white px-4 py-1 rounded font-bold hover:bg-blue-500 transition shadow-sm"
                  >
                    {t("dashboard")}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                  className="hover:text-slate-300 transition"
                >
                  {tCommon("logout")}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href={`/${currentLocale}/login`} className="hover:text-slate-300 transition">
                  {t("login")}
                </Link>
                <Link
                  href={`/${currentLocale}/register`}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition"
                >
                  {tCommon("register")}
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle Hamburger */}
            <button
              className="md:hidden ml-2 p-2 text-slate-300 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-700 flex flex-col space-y-4 pb-2">
            <Link href={`/${currentLocale}`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-amber-400 transition">
              {t("home")}
            </Link>
            
            <div className="flex flex-col space-y-2">
              <Link href={`/${currentLocale}/products`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-amber-500 hover:text-amber-400 transition">
                {t("products")} (All)
              </Link>
              <div className="flex flex-col pl-4 border-l-2 border-slate-700 space-y-2">
                <Link href={`/${currentLocale}/products?category=MTG`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition">
                  • MTG Singles
                </Link>
                <Link href={`/${currentLocale}/products?category=SEALED`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition">
                  • Sealed Products
                </Link>
                <Link href={`/${currentLocale}/products?category=MERCHANDISE`} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition">
                  • Merchandise
                </Link>
              </div>
            </div>

            <Link href={`/${currentLocale}/wholesale`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-amber-400 transition">
              {t("wholesale")}
            </Link>
            <Link href={`/${currentLocale}/testimonials`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-amber-400 transition">
              {t("testimonials")}
            </Link>

            {/* Mobile Authentication Links */}
            <div className="pt-4 mt-2 border-t border-slate-700 flex flex-col space-y-4">
              {status === "loading" ? (
                <span className="text-slate-500">...</span>
              ) : session ? (
                <>
                  <span className="text-slate-400 text-sm">
                    {t("hello", { email: session.user?.email || "" })}
                  </span>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-yellow-500 hover:text-yellow-400 transition"
                    >
                      {t("admin")}
                    </Link>
                  ) : (
                    <Link
                      href={`/${currentLocale}/dashboard`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-blue-400 hover:text-blue-300 transition"
                    >
                      {t("dashboard")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: `/${currentLocale}` });
                    }}
                    className="text-lg text-left text-red-400 hover:text-red-300 transition"
                  >
                    {tCommon("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link href={`/${currentLocale}/login`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-amber-400 transition">
                    {t("login")}
                  </Link>
                  <Link href={`/${currentLocale}/register`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg hover:text-amber-400 transition">
                    {tCommon("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
      {children}
    </>
  );
}