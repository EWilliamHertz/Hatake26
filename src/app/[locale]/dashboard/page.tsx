import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

// Define interfaces for TypeScript build safety
interface Order {
  id: string;
  orderNumber: number;
  customerEmail: string;
  customerName: string;
  totalValue: number;
  status: string;
  createdAt: Date | string;
}

interface Inquiry {
  id: string;
  customerEmail: string;
  customerName: string;
  message: string | null;
  totalValue: number;
  createdAt: Date | string;
}

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Explicitly type the results to satisfy Vercel's build checks
  const orders: Order[] = await prisma.order.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: 'desc' }
  }) as any;

  const inquiries: Inquiry[] = await prisma.inquiry.findMany({
    where: { customerEmail: session.user.email },
    orderBy: { createdAt: 'desc' }
  }) as any;

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">My Dashboard</h1>
        <p className="text-slate-600 mb-10">Welcome back, {session.user.email}. Track your orders and inquiries below.</p>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">My Orders (Payment Codes)</h2>
          {orders.length === 0 ? (
            <p className="text-slate-500 italic">You have no active orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b">
                    <th className="pb-2">Payment Code</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 font-bold text-lg">#{order.orderNumber}</td>
                      <td className="py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium">{order.totalValue} SEK</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inquiries Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">My Wholesale Inquiries</h2>
          {inquiries.length === 0 ? (
            <p className="text-slate-500 italic">You have not submitted any wholesale requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Message Attached</th>
                    <th className="pb-2">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="border-b last:border-0">
                      <td className="py-3 text-slate-600">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 text-slate-700 truncate max-w-xs">{inq.message || "No message"}</td>
                      <td className="py-3 font-bold text-green-700">{inq.totalValue} SEK</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}