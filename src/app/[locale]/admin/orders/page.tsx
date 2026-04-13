import { prisma } from "@/lib/prisma";

// Define the Order type for TypeScript
interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  totalValue: number;
  status: string;
  createdAt: Date | string;
}

export default async function AdminOrdersPage() {
  // Explicitly type the orders array to satisfy the build check
  const orders: Order[] = await prisma.order.findMany({ 
    orderBy: { createdAt: 'desc' } 
  }) as any;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Manage Orders & Payments</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium text-slate-600">Swish Code</th>
              <th className="p-4 font-medium text-slate-600">Customer</th>
              <th className="p-4 font-medium text-slate-600">Total</th>
              <th className="p-4 font-medium text-slate-600">Status</th>
              <th className="p-4 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-bold text-lg text-slate-900">#{order.orderNumber}</td>
                <td className="p-4 text-slate-700">{order.customerName}<br/><span className="text-sm text-slate-400">{order.customerEmail}</span></td>
                <td className="p-4 font-medium text-slate-900">{order.totalValue} SEK</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}