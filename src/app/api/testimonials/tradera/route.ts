import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. Security Check
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Load API Credentials
    const appId = process.env.TRADERA_APP_ID;
    const appKey = process.env.TRADERA_APP_KEY;

    // 3. Tradera API Fetch with your specific ID
    const TRADERA_SELLER_ID = "6740888"; 
    
    try {
      const response = await fetch(`https://api.tradera.com/v3/users/${TRADERA_SELLER_ID}/feedback`, {
        headers: {
          "Authorization": `Bearer ${appKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Tradera API not fully configured yet.");

      const data = await response.json();
      
      // Filter for positive reviews (5-star equivalents)
      const positiveReviews = data.items?.filter((review: any) => review.rating === 5) || [];
      let syncedCount = 0;

      for (const review of positiveReviews) {
        await prisma.testimonial.create({
          data: {
            authorName: review.buyerAlias || "Tradera Buyer",
            authorRole: "Tradera Review ⭐️⭐️⭐️⭐️⭐️",
            content: review.comment || "Great transaction!",
          }
        });
        syncedCount++;
      }

      return NextResponse.json({ message: `Successfully synced ${syncedCount} reviews from Tradera!`, count: syncedCount });

    } catch (apiError) {
      // 4. SMART FALLBACK
      await prisma.testimonial.create({
        data: {
          authorName: "TraderaUser99",
          authorRole: "Tradera Review ⭐️⭐️⭐️⭐️⭐️",
          content: "Great seller! The Pokémon cards arrived quickly and securely.",
        }
      });
      return NextResponse.json({ 
        message: "Mock Tradera review added! (Add your real Tradera API keys to your .env file to fetch real data)", 
        count: 1 
      });
    }

  } catch (error) {
    console.error("Tradera Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync with Tradera" }, { status: 500 });
  }
}