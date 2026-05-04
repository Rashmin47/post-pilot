import { NextResponse } from "next/server";
import { autoReplyQueue } from "@/lib/queues/auto-reply";

export async function POST(req: Request) {
  try {
    // Platform identification usually via headers or payload
    const platform = req.headers.get("x-platform"); 
    const body = await req.json();

    console.log(`Received webhook from ${platform || "unknown platform"}`);

    // This is where we would validate signatures and parse platform-specific payloads
    // For demonstration, we expect a unified payload or we transform it here
    
    // { commentId, commentText, postId, platform, accountId }
    const { commentId, commentText, postId, accountId } = body;

    if (commentId && commentText && platform && accountId) {
      await autoReplyQueue.add("process-comment", {
        commentId,
        commentText,
        postId,
        platform,
        accountId,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
