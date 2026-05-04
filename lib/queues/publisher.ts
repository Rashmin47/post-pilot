import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { db } from "@/lib/db";
import { posts, postPlatformResults, socialAccounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { twitterClient } from "@/lib/platforms/twitter";
import { decrypt } from "@/lib/encryption";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn("REDIS_URL is not set. BullMQ will not function correctly.");
}

const connection = new IORedis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const publisherQueue = new Queue("publisher", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export const publisherWorker = new Worker(
  "publisher",
  async (job: Job) => {
    const { postId } = job.data;
    
    console.log(`Processing post ${postId}`);

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      console.error(`Post ${postId} not found`);
      return;
    }

    const selectedPlatforms = post.platforms as string[];
    
    for (const platform of selectedPlatforms) {
      try {
        // Find the connected account for this platform
        const account = await db.query.socialAccounts.findFirst({
          where: and(
            eq(socialAccounts.userId, post.userId),
            eq(socialAccounts.platform, platform as any),
            eq(socialAccounts.isActive, true)
          ),
        });

        if (!account) {
          throw new Error(`No active account found for platform: ${platform}`);
        }

        const accessToken = decrypt(account.accessToken);
        let platformPostId = "";

        if (platform === "twitter") {
          const result = await twitterClient.publishPost(accessToken, post.content || "", {
            mediaUrls: (post.mediaUrls as string[]) || [],
          });
          platformPostId = result.platformPostId;
        } else {
          // Placeholder for other platforms
          console.warn(`Publishing to ${platform} is not yet implemented. Skipping.`);
          continue;
        }

        // Record success
        await db.insert(postPlatformResults).values({
          postId: post.id,
          platform: platform as any,
          platformPostId,
          status: "success",
        });

      } catch (error: any) {
        console.error(`Failed to publish to ${platform}:`, error);
        
        await db.insert(postPlatformResults).values({
          postId: post.id,
          platform: platform as any,
          status: "failed",
          error: error.message,
        });
      }
    }

    // Update post status to published (or failed if all failed)
    const results = await db.query.postPlatformResults.findMany({
      where: eq(postPlatformResults.postId, post.id),
    });

    const allSucceeded = results.length === selectedPlatforms.length && results.every(r => r.status === "success");
    const anySucceeded = results.some(r => r.status === "success");

    await db.update(posts)
      .set({ 
        status: allSucceeded ? "published" : (anySucceeded ? "published" : "failed"),
        publishedAt: anySucceeded ? new Date() : null
      })
      .where(eq(posts.id, post.id));
  },
  { connection }
);
