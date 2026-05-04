import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyLogs, autoReplyRules } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Join logs with rules to ensure the user owns the rule associated with the log
  const logs = await db.select({
    id: autoReplyLogs.id,
    platform: autoReplyLogs.platform,
    commentId: autoReplyLogs.commentId,
    commentText: autoReplyLogs.commentText,
    replyText: autoReplyLogs.replyText,
    sentAt: autoReplyLogs.sentAt,
    ruleName: autoReplyRules.name,
  })
  .from(autoReplyLogs)
  .innerJoin(autoReplyRules, eq(autoReplyLogs.ruleId, autoReplyRules.id))
  .where(eq(autoReplyRules.userId, userId))
  .orderBy(desc(autoReplyLogs.sentAt));

  return NextResponse.json(logs);
}
