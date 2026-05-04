import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const planEnum = pgEnum("plan", ["free", "pro", "agency"]);
export const platformEnum = pgEnum("platform", [
  "instagram",
  "youtube",
  "facebook",
  "linkedin",
  "pinterest",
  "discord",
  "twitter",
  "slack",
]);
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "published",
  "failed",
]);

// Tables
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text to match Clerk's ID
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  plan: planEnum("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  accountName: text("account_name"),
  accountId: text("account_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  mediaUrls: jsonb("media_urls").$type<string[]>(),
  platforms: jsonb("platforms").$type<string[]>(), // Array of platforms to post to
  status: postStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postPlatformResults = pgTable("post_platform_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  platformPostId: text("platform_post_id"),
  status: text("status").notNull(), // e.g., 'success', 'error'
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const autoReplyRules = pgTable("auto_reply_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(), // e.g., 'keyword', 'sentiment', 'all'
  keywords: jsonb("keywords").$type<string[]>(),
  replyMode: text("reply_mode").notNull(), // e.g., 'template', 'ai'
  replyTemplate: text("reply_template"),
  platforms: jsonb("platforms").$type<string[]>(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const autoReplyLogs = pgTable("auto_reply_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ruleId: uuid("rule_id")
    .notNull()
    .references(() => autoReplyRules.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  commentId: text("comment_id").notNull(),
  commentText: text("comment_text"),
  replyText: text("reply_text"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageKitFileId: text("imagekit_file_id").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // e.g., 'image', 'video'
  size: integer("size"),
  folder: text("folder"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: uuid("account_id").references(() => socialAccounts.id, {
    onDelete: "cascade",
  }),
  platform: platformEnum("platform").notNull(),
  date: timestamp("date").notNull(),
  followers: integer("followers").default(0).notNull(),
  engagement: integer("engagement").default(0).notNull(),
  reach: integer("reach").default(0).notNull(),
  postsCount: integer("posts_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  socialAccounts: many(socialAccounts),
  posts: many(posts),
  autoReplyRules: many(autoReplyRules),
  mediaAssets: many(mediaAssets),
  analyticsSnapshots: many(analyticsSnapshots),
}));

export const socialAccountsRelations = relations(socialAccounts, ({ one }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  results: many(postPlatformResults),
}));

export const postPlatformResultsRelations = relations(
  postPlatformResults,
  ({ one }) => ({
    post: one(posts, {
      fields: [postPlatformResults.postId],
      references: [posts.id],
    }),
  })
);

export const autoReplyRulesRelations = relations(
  autoReplyRules,
  ({ one, many }) => ({
    user: one(users, {
      fields: [autoReplyRules.userId],
      references: [users.id],
    }),
    logs: many(autoReplyLogs),
  })
);

export const autoReplyLogsRelations = relations(autoReplyLogs, ({ one }) => ({
  rule: one(autoReplyRules, {
    fields: [autoReplyLogs.ruleId],
    references: [autoReplyRules.id],
  }),
}));

export const mediaAssetsRelations = relations(mediaAssets, ({ one }) => ({
  user: one(users, {
    fields: [mediaAssets.userId],
    references: [users.id],
  }),
}));

export const analyticsSnapshotsRelations = relations(
  analyticsSnapshots,
  ({ one }) => ({
    user: one(users, {
      fields: [analyticsSnapshots.userId],
      references: [users.id],
    }),
    account: one(socialAccounts, {
      fields: [analyticsSnapshots.accountId],
      references: [socialAccounts.id],
    }),
  })
);
