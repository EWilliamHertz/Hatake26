import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);   

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, message, items, totalValue } = body;

    // 1. Save to NeonDB
    const inquiry = await prisma.inquiry.create({
      data: {
        customerName,
        customerEmail,
        message,
        items,
        totalValue,
      },
    });

    // 2. Send Email to Admins
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Replace with your verified domain later
      to: ["ernst@hatake.eu", "patricia@hatake.eu"],
      subject: `New Wholesale Inquiry from ${customerName}`,
      html: `
        <h2>New Wholesale Inquiry</h2>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Message:</strong> ${message || 'N/A'}</p>
        <p><strong>Calculated Total Value:</strong> ${totalValue} SEK</p>
        <h3>Requested Items:</h3>
        <ul>
          ${items.map((item: any) => `<li>${item.quantity}x ${item.name} (Discounted Price: ${item.discountedPrice} SEK)</li>`).join('')}
        </ul>
        <p><a href="https://yourdomain.com/admin">View in Admin Panel</a></p>
      `,
    });

    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  } catch (error) {
    console.error("Inquiry Error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}