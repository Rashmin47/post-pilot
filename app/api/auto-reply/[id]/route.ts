import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyRules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    
    const [updatedRule] = await db
      .update(autoReplyRules)
      .set(body)
      .where(and(eq(autoReplyRules.id, id), eq(autoReplyRules.userId, userId)))
      .returning();

    if (!updatedRule) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error("Failed to update auto-reply rule:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [deletedRule] = await db
      .delete(autoReplyRules)
      .where(and(eq(autoReplyRules.id, id), eq(autoReplyRules.userId, userId)))
      .returning();

    if (!deletedRule) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete auto-reply rule:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
