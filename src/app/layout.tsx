import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image"; // Added the Image component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hatake KB - TCG Merchandise",
  description: "Your premium source for Magic: The Gathering singles and Sealed Pokémon products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <nav className="bg-slate-900 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Left side: Logo and Main Links */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center gap-2 mr-4">
                {/* Increased size from 40 to 72 */}
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

            {/* Right side: Auth Links */}
            <div className="flex items-center space-x-4 text-sm font-medium">
              <Link href="/login" className="hover:text-slate-300 transition">Login</Link>
              <Link href="/register" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md transition">Register</Link>
            </div>

          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}