import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST new product (Requires Admin)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, imageUrl, isSingle, scryfallId, edition, stock, price, category, images } = body;

    const product = await prisma.product.create({
      data: { 
        name, description, imageUrl, isSingle, scryfallId, edition, 
        stock: Number(stock), 
        price: Number(price || 0), 
        category: category || (isSingle ? "MTG" : "SEALED"),
        images: images || [] // Save the array of images
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}