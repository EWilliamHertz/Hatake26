"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Provider from "@/components/Provider";
import { useSession, signOut } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Provider>
          <NavWrapper children={children} />
        </Provider>
      </body>
    </html>
  );
}

function NavWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <>
      <nav className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <Image src="/logo.png" alt="Hatake KB Logo" width={72} height={72} className="rounded-md" />
              <span className="text-2xl font-bold tracking-tight hidden sm:block">Hatake KB</span>
            </Link>
            <div className="space-x-6 text-sm font-medium hidden md:block">
              <Link href="/" className="hover:text-slate-300 transition">Home</Link>
              <Link href="/products" className="hover:text-slate-300 transition">Products</Link>
              <Link href="/wholesale" className="hover:text-slate-300 transition">Wholesale</Link>
              <Link href="/testimonials" className="hover:text-slate-300 transition">Testimonials</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm font-medium">
            {status === "loading" ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <span className="text-slate-300 mr-2">Hello {session.user?.email}</span>
                {isAdmin && (
                  <Link href="/admin" className="bg-yellow-500 text-slate-900 px-4 py-2 rounded font-bold hover:bg-yellow-400 transition shadow-sm">
                    Dashboard
                  </Link>
                )}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="hover:text-slate-300 transition">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-slate-300 transition">Login</Link>
                <Link href="/register" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}