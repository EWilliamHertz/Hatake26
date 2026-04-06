import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appId = process.env.TRADERA_APP_ID;
    const appKey = process.env.TRADERA_APP_KEY;

    if (!appId || !appKey) {
      return NextResponse.json({ error: "TRADERA_APP_ID or TRADERA_APP_KEY is missing in .env." }, { status: 500 });
    }

    const TRADERA_SELLER_ID = "6740888"; 
    
    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <AuthenticationHeader xmlns="http://api.tradera.com">
      <AppId>${appId}</AppId>
      <AppKey>${appKey}</AppKey>
    </AuthenticationHeader>
  </soap:Header>
  <soap:Body>
    <GetFeedback xmlns="http://api.tradera.com">
      <userId>${TRADERA_SELLER_ID}</userId>
      <pageNumber>1</pageNumber>
    </GetFeedback>
  </soap:Body>
</soap:Envelope>`;

    const response = await fetch("https://api.tradera.com/v3/PublicService.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": '"http://api.tradera.com/GetFeedback"'
      },
      body: soapBody
    });

    const xmlText = await response.text();

    // --- SMART ERROR HANDLING ---
    if (xmlText.includes("NotEnabled")) {
      // If Tradera hasn't approved the keys yet, insert a placeholder review so the UI doesn't break
      await prisma.testimonial.create({
        data: {
          authorName: "Tradera System",
          authorRole: "Status Update",
          content: "Your Tradera API keys are working, but Tradera Support still needs to enable 'GetFeedback' for your account. Once they reply to your email, click sync again and your real reviews will appear here!",
        }
      });
      return NextResponse.json({ 
        message: "Tradera Keys are correct, but pending activation by Tradera Support! Added a placeholder status review for now." 
      });
    }

    if (!response.ok) {
      throw new Error(`Tradera API Rejected the Request: ${xmlText.substring(0, 400)}`);
    }

    const comments = [...xmlText.matchAll(/<[^>]*?Comment>(.*?)<\/[^>]*?Comment>/g)].map(m => m[1]);
    const aliases = [...xmlText.matchAll(/<[^>]*?Alias>(.*?)<\/[^>]*?Alias>/g)].map(m => m[1]);

    if (comments.length === 0) {
      throw new Error(`Could not find any comments. XML: ${xmlText.substring(0, 400)}`);
    }

    await prisma.testimonial.deleteMany({
      where: { authorRole: { contains: "Tradera" } }
    });

    let syncedCount = 0;
    const countToSync = Math.min(comments.length, aliases.length, 20); 

    for (let i = 0; i < countToSync; i++) {
      if (comments[i] && comments[i].trim() !== "") {
        await prisma.testimonial.create({
          data: {
            authorName: aliases[i] || "Tradera Buyer",
            authorRole: "Verified Tradera Review ⭐️⭐️⭐️⭐️⭐️",
            content: comments[i],
          }
        });
        syncedCount++;
      }
    }

    return NextResponse.json({ message: `Successfully synced ${syncedCount} REAL reviews from Tradera!`, count: syncedCount });

  } catch (error: any) {
    console.error("Tradera Sync Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
  }
}