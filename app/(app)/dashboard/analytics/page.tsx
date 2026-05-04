"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Send,
  Calendar,
  Filter
} from "lucide-react";
import { StatsCard } from "@/components/analytics/stats-card";
import { EngagementChart, PlatformDistribution } from "@/components/analytics/analytics-charts";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsData } from "@/lib/analytics";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?days=${days}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48 bg-[#1e1e2e]" />
          <Skeleton className="h-4 w-64 bg-[#1e1e2e]" />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-[#1e1e2e]" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-xl bg-[#1e1e2e]" />
          <Skeleton className="h-[400px] rounded-xl bg-[#1e1e2e]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics Overview</h1>
          <p className="text-[#64748b]">
            Track your performance and audience growth across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d1a] border border-[#1e1e2e] rounded-lg">
            <Filter className="w-4 h-4 text-[#3f3f5a]" />
            <span className="text-xs font-medium text-[#64748b]">Range:</span>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[120px] h-7 border-none bg-transparent p-0 text-xs font-bold focus:ring-0">
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d0d1a] border-[#1e1e2e]">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="border-[#1e1e2e] bg-[#0d0d1a] text-xs font-bold">
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Posts"
          value={data?.kpis.totalPosts || 0}
          description="Lifetime posts created"
          icon={Send}
        />
        <StatsCard
          title="Published"
          value={data?.kpis.publishedPosts || 0}
          description="Successfully published"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Avg. Engagement"
          value={`${data?.kpis.growth || 0}%`}
          description="Engagement rate growth"
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="AI Auto-Replies"
          value={data?.kpis.totalReplies || 0}
          description="Automated responses sent"
          icon={MessageSquare}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <EngagementChart 
          data={data?.trends || []} 
          title="Engagement & Reach Trends" 
        />
        <PlatformDistribution 
          data={data?.distribution || []} 
        />
      </div>

      <div className="bg-[#0d0d1a]/50 border border-[#1e1e2e] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-brand-indigo/20">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-bold mb-2">Want deeper insights?</h3>
          <p className="text-sm text-[#64748b]">
            Upgrade to the <span className="text-brand-indigo font-bold">Pro Plan</span> to unlock advanced audience demographics, competitor analysis, and detailed post-level metrics.
          </p>
        </div>
        <Button className="gradient-bg border-none px-8 font-bold">
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
