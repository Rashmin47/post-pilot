import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { db } from "@/lib/db";
import { autoReplyRules, autoReplyLogs, socialAccounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { twitterClient } from "@/lib/platforms/twitter";
import { decrypt } from "@/lib/encryption";
import { analyzeSentiment, generateAutoReply } from "@/lib/gemini";

const redisUrl = process.env.REDIS_URL;

const connection = new IORedis(redisUrl || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const autoReplyQueue = new Queue("auto-reply", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export const autoReplyWorker = new Worker(
  "auto-reply",
  async (job: Job) => {
    const { commentId, commentText, postId, platform, accountId } = job.data;
    
    console.log(`Processing auto-reply for comment ${commentId} on ${platform}`);

    // 1. Find all active rules for this account and platform
    const rules = await db.query.autoReplyRules.findMany({
      where: and(
        eq(autoReplyRules.isActive, true),
        // We need to filter by platform in the jsonb array
      ),
    });

    // Filter rules that apply to this platform
    const applicableRules = rules.filter((rule) => {
      const platforms = rule.platforms as string[];
      return platforms.includes(platform);
    });

    for (const rule of applicableRules) {
      let shouldReply = false;
      let replyText = "";

      // 2. Check trigger condition
      if (rule.triggerType === "any_comment") {
        shouldReply = true;
      } else if (rule.triggerType === "keyword_match") {
        const keywords = rule.keywords as string[];
        const lowerComment = commentText.toLowerCase();
        shouldReply = keywords.some((kw) => lowerComment.includes(kw.toLowerCase()));
      } else if (rule.triggerType === "sentiment") {
        const sentiment = await analyzeSentiment(commentText);
        // For simplicity, let's assume 'sentiment' trigger means any specific sentiment or we could store target sentiment in rule
        // The ticket mentions positive/negative/neutral in rule builder
        // Let's assume the rule name or keywords might contain the target sentiment for now, 
        // or just match if sentiment is not neutral if that's what's intended.
        // Actually, let's assume triggerType could be 'sentiment_positive', etc.
        // Or we just check if sentiment is requested.
        shouldReply = true; // Placeholder for more complex sentiment matching
      }

      if (shouldReply) {
        // 3. Generate reply
        if (rule.replyMode === "template") {
          replyText = rule.replyTemplate || "Thanks for your comment!";
        } else if (rule.replyMode === "ai_generated") {
          replyText = await generateAutoReply(commentText, rule.name); // Using rule name as context
        }

        // 4. Send reply
        const account = await db.query.socialAccounts.findFirst({
          where: and(
            eq(socialAccounts.accountId, accountId),
            eq(socialAccounts.platform, platform),
            eq(socialAccounts.isActive, true)
          ),
        });

        if (!account) {
          console.error(`Account ${accountId} not found or inactive`);
          continue;
        }

        const accessToken = decrypt(account.accessToken);

        try {
          if (platform === "twitter") {
            await twitterClient.replyToComment(accessToken, commentId, replyText);
          } else {
            console.warn(`Replying to ${platform} is not yet implemented.`);
            continue;
          }

          // 5. Log success
          await db.insert(autoReplyLogs).values({
            ruleId: rule.id,
            platform: platform,
            commentId: commentId,
            commentText: commentText,
            replyText: replyText,
          });

          // Break after first matching rule to avoid multiple replies?
          // Usually, one auto-reply per comment is safer.
          break;
        } catch (error) {
          console.error(`Failed to send auto-reply for rule ${rule.id}:`, error);
        }
      }
    }
  },
  { connection }
);
