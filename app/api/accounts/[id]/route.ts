import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await db
      .delete(socialAccounts)
      .where(and(eq(socialAccounts.id, id), eq(socialAccounts.userId, userId)))
      .returning();

    if (result.length === 0) {
      return new NextResponse("Account not found", { status: 404 });
    }

    return new NextResponse("Account disconnected", { status: 200 });
  } catch (error) {
    console.error("Delete account error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
