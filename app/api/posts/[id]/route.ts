import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, mediaUrls, platforms, scheduledAt, status } = await req.json();

    const [updatedPost] = await db
      .update(posts)
      .set({
        content,
        mediaUrls,
        platforms,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status,
      })
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .returning();

    if (!updatedPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[POST_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [deletedPost] = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .returning();

    if (!deletedPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
