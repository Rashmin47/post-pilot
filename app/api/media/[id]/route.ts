import { db } from "@/lib/db";
import { mediaAssets } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

    // Get asset details to get ImageKit fileId
    const [asset] = await db
      .select()
      .from(mediaAssets)
      .where(and(eq(mediaAssets.id, id), eq(mediaAssets.userId, userId)))
      .limit(1);

    if (!asset) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete from ImageKit
    try {
      await imagekit.deleteFile(asset.imageKitFileId);
    } catch (ikError) {
      console.error("[IMAGEKIT_DELETE_ERROR]", ikError);
      // Even if ImageKit delete fails (e.g., file already gone), we proceed to delete from DB
      // or we could decide to handle it differently.
    }

    // Delete from DB
    await db
      .delete(mediaAssets)
      .where(and(eq(mediaAssets.id, id), eq(mediaAssets.userId, userId)));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MEDIA_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
