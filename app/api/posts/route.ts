import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { publisherQueue } from "@/lib/queues/publisher";
import { checkPlanLimit } from "@/lib/plan-limits";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const allPosts = await db.query.posts.findMany({
      where: eq(posts.userId, userId),
      orderBy: [desc(posts.createdAt)],
      with: {
        results: true,
      },
    });

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, mediaUrls, platforms, scheduledAt } = await req.json();

    if (!platforms || platforms.length === 0) {
      return new NextResponse("At least one platform is required", { status: 400 });
    }

    // Check plan limits
    const { allowed, current, limit } = await checkPlanLimit(userId, "maxPostsPerMonth");
    if (!allowed) {
      return new NextResponse(`Plan limit reached: ${current}/${limit} posts this month. Upgrade to Pro for unlimited posts.`, { status: 403 });
    }

    const status = scheduledAt ? "scheduled" : "draft";

    const [newPost] = await db.insert(posts).values({
      userId,
      content,
      mediaUrls,
      platforms,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    }).returning();

    // If scheduled for later, use delay in BullMQ
    // If not scheduled (post now), enqueue immediately
    const delay = scheduledAt ? new Date(scheduledAt).getTime() - Date.now() : 0;

    await publisherQueue.add(
      "publish-post",
      { postId: newPost.id },
      { delay: Math.max(0, delay) }
    );

    // If it was meant to be "Post Now", update status to something that indicates it's being processed
    // Or just let the worker update it to published.
    // The spec says "Post Now" publishes immediately.

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("[POSTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
