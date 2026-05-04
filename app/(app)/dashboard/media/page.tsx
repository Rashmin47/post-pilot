import { db } from "@/lib/db";
import { mediaAssets, users } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq, sql } from "drizzle-orm";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaUpload } from "@/components/media/media-upload";
import { StorageUsageBar } from "@/components/media/storage-usage-bar";
import { FolderSidebar } from "@/components/media/folder-sidebar";
import { redirect } from "next/navigation";

export default async function MediaPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user data for plan
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch assets
  const assets = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.userId, userId))
    .orderBy(desc(mediaAssets.createdAt));

  // Calculate total used storage
  const [usage] = await db
    .select({ total: sql<number>`sum(size)` })
    .from(mediaAssets)
    .where(eq(mediaAssets.userId, userId));

  const usedBytes = Number(usage?.total || 0);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your images and videos for social posts.
          </p>
        </div>
        <div className="w-64">
          <StorageUsageBar usedBytes={usedBytes} plan={user.plan as any} />
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <FolderSidebar />
        </div>
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <MediaUpload />
          <MediaGrid initialAssets={assets} />
        </div>
      </div>
    </div>
  );
}
