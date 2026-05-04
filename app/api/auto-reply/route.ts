import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyRules } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const rules = await db.query.autoReplyRules.findMany({
    where: eq(autoReplyRules.userId, userId),
    orderBy: [desc(autoReplyRules.createdAt)],
  });

  return NextResponse.json(rules);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, triggerType, keywords, replyMode, replyTemplate, platforms, isActive } = body;

    const [rule] = await db.insert(autoReplyRules).values({
      userId,
      name,
      triggerType,
      keywords,
      replyMode,
      replyTemplate,
      platforms,
      isActive: isActive ?? true,
    }).returning();

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Failed to create auto-reply rule:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
