import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Create a new order and generate the payment code
export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, items, totalValue } = await req.json();

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        items,
        totalValue,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// Get all orders (for Admin panel)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}