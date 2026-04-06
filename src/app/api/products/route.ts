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
    const userRole = (session?.user as any)?.role;
    
    // Allow creating products if authenticated (temporary fix for development)
    // TODO: Restore strict ADMIN check when authentication is properly configured
    if (!session) {
      console.warn("POST /api/products: No session found");
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, imageUrl, isSingle, scryfallId, edition, stock, price, category, images } = body;

    // Validate required fields
    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Name and imageUrl are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { 
        name, 
        description: description || "", 
        imageUrl, 
        isSingle: isSingle || false, 
        scryfallId: scryfallId || null, 
        edition: edition || null, 
        stock: Number(stock) || 0, 
        price: Number(price || 0), 
        category: category || (isSingle ? "MTG" : "SEALED"),
        images: images || [] // Save the array of images
      },
    });

    console.log("Product created:", product.id, product.name);
    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/products error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create product", details: errorMessage }, { status: 500 });
  }
}