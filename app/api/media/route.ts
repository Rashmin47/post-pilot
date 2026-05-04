import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const mediaAssetSchema = z.object({
  imageKitFileId: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number().optional(),
  folder: z.string().optional(),
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const assets = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.userId, userId))
      .orderBy(desc(mediaAssets.createdAt));

    return NextResponse.json(assets);
  } catch (error) {
    console.error("[MEDIA_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = mediaAssetSchema.parse(body);

    const [asset] = await db
      .insert(mediaAssets)
      .values({
        userId,
        imageKitFileId: validatedData.imageKitFileId,
        url: validatedData.url,
        type: validatedData.type,
        size: validatedData.size,
        folder: validatedData.folder || "/",
      })
      .returning();

    return NextResponse.json(asset);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("[MEDIA_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
