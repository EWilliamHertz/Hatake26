"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/CartDrawer";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] as string;

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
              className="relative hover:text-amber-400 transition mr-4"
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
              <span className="text-slate-500">...</span>
            ) : session ? (
              <>
                <span className="text-slate-300 mr-2">
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
                  {useTranslations("Common")("logout")}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${currentLocale}/login`} className="hover:text-slate-300 transition">
                  {t("login")}
                </Link>
                <Link
                  href={`/${currentLocale}/register`}
                  className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition"
                >
                  {useTranslations("Common")("register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer />
      {children}
    </>
  );
}
