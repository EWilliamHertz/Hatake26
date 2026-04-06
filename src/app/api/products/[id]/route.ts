import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, stock, category } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { 
        name, 
        description, 
        price: Number(price), 
        stock: Number(stock), 
        category 
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// NEW: Fetch a single product INCLUDING its massive image gallery
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product gallery" }, { status: 500 });
  }
}