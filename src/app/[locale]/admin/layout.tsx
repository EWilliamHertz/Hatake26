import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import React from "react";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/"); 
  }

  return (
    <div className="flex flex-grow min-h-full">
      <AdminSidebar />
      <main className="flex-grow p-10 bg-slate-50">
        {children}
      </main>
    </div>
  );
}