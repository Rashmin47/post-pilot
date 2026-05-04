import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("glass-card border-[#1e1e2e] bg-[#0d0d1a]/50 hover:bg-[#0d0d1a]/80 transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#64748b]">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-lg bg-brand-indigo/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-indigo" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded-full",
                  trend.isPositive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className="text-xs text-[#3f3f5a] truncate">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
