import { prisma } from "@/lib/prisma";

// Define the Inquiry type so TypeScript understands the structure
interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string | null;
  totalValue: number;
  createdAt: Date | string;
}

export default async function AdminInquiriesPage() {
  // Explicitly type the inquiries array
  const inquiries: Inquiry[] = await prisma.inquiry.findMany({ 
    orderBy: { createdAt: 'desc' } 
  }) as any;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Wholesale Inquiries</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium text-slate-600">Company / Name</th>
              <th className="p-4 font-medium text-slate-600">Message</th>
              <th className="p-4 font-medium text-slate-600">Value</th>
              <th className="p-4 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inq => (
              <tr key={inq.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{inq.customerName}<br/><span className="text-sm text-slate-400">{inq.customerEmail}</span></td>
                <td className="p-4 text-slate-700 text-sm max-w-xs truncate">{inq.message || "No message attached."}</td>
                <td className="p-4 font-bold text-green-700">{inq.totalValue} SEK</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(inq.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}