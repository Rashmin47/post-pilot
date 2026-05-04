"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StorageUsageBarProps {
  usedBytes: number;
  plan: "free" | "pro" | "agency";
  className?: string;
}

const PLAN_LIMITS = {
  free: 500 * 1024 * 1024, // 500 MB
  pro: 5 * 1024 * 1024 * 1024, // 5 GB
  agency: 50 * 1024 * 1024 * 1024, // 50 GB
};

export const StorageUsageBar = ({
  usedBytes,
  plan,
  className,
}: StorageUsageBarProps) => {
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const percentage = Math.min((usedBytes / limit) * 100, 100);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs font-medium">
        <span>Storage Usage</span>
        <span className="text-muted-foreground">
          {formatSize(usedBytes)} of {formatSize(limit)}
        </span>
      </div>
      <Progress value={percentage} className="h-1.5" />
      <p className="text-[10px] text-muted-foreground">
        Your current plan is <span className="font-semibold capitalize text-primary">{plan}</span>.
      </p>
    </div>
  );
};
