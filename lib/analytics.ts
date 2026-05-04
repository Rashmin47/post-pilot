import { db } from "./db";
import { posts, autoReplyLogs, analyticsSnapshots } from "./db/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export interface AnalyticsTrendPoint {
  date: string;
  engagement: number;
  reach: number;
  followers: number;
}

export interface AnalyticsData {
  kpis: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    totalReplies: number;
    growth: number | string;
  };
  trends: AnalyticsTrendPoint[];
  distribution: {
    name: string;
    value: number;
  }[];
}

export async function getAnalyticsData(userId: string, days: number = 30): Promise<AnalyticsData> {
  const startDate = startOfDay(subDays(new Date(), days));
  const endDate = endOfDay(new Date());

  // 1. Aggregated KPI Metrics
  const [postMetrics] = await db
    .select({
      total: sql<number>`count(*)`,
      published: sql<number>`count(*) filter (where status = 'published')`,
      scheduled: sql<number>`count(*) filter (where status = 'scheduled')`,
    })
    .from(posts)
    .where(eq(posts.userId, userId));

  const [replyMetrics] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(autoReplyLogs)
    .innerJoin(posts, eq(posts.userId, userId)); // Simplification: logs are linked to rules, but we want user logs

  // 2. Engagement & Reach Trends (from snapshots)
  const snapshots = await db.query.analyticsSnapshots.findMany({
    where: and(
      eq(analyticsSnapshots.userId, userId),
      gte(analyticsSnapshots.date, startDate),
      lte(analyticsSnapshots.date, endDate)
    ),
    orderBy: [desc(analyticsSnapshots.date)],
  });

  // Group snapshots by date for charts
  const trendData = Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, "MMM dd");
    const daySnapshots = snapshots.filter(
      (s) => format(s.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    return {
      date: dateStr,
      engagement: daySnapshots.reduce((acc, s) => acc + s.engagement, 0),
      reach: daySnapshots.reduce((acc, s) => acc + s.reach, 0),
      followers: daySnapshots.reduce((acc, s) => acc + s.followers, 0),
    };
  }).reverse();

  // 3. Platform Distribution
  const platformStats = await db
    .select({
      platform: posts.platforms,
      count: sql<number>`count(*)`,
    })
    .from(posts)
    .where(eq(posts.userId, userId))
    .groupBy(posts.platforms);

  // Flatten platform distribution (since platforms is a jsonb array)
  const distribution: Record<string, number> = {};
  platformStats.forEach((row) => {
    const platforms = (row.platform as string[]) || [];
    platforms.forEach((p) => {
      distribution[p] = (distribution[p] || 0) + Number(row.count);
    });
  });

  return {
    kpis: {
      totalPosts: Number(postMetrics?.total || 0),
      publishedPosts: Number(postMetrics?.published || 0),
      scheduledPosts: Number(postMetrics?.scheduled || 0),
      totalReplies: Number(replyMetrics?.total || 0),
      growth: calculateGrowth(trendData),
    },
    trends: trendData,
    distribution: Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    })),
  };
}

function calculateGrowth(data: AnalyticsTrendPoint[]) {
  if (data.length < 2) return 0;
  const current = data[data.length - 1].followers;
  const previous = data[0].followers;
  if (previous === 0) return 0;
  return (((current - previous) / previous) * 100).toFixed(1);
}
