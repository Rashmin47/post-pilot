import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { socialAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const accounts = await db.query.socialAccounts.findMany({
    where: eq(socialAccounts.userId, userId),
    orderBy: (socialAccounts, { desc }) => [desc(socialAccounts.createdAt)],
  });

  // Omit tokens from the response for security
  const safeAccounts = accounts.map(({ accessToken, refreshToken, ...rest }) => rest);

  return NextResponse.json(safeAccounts);
}
