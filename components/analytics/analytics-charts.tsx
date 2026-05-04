"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f97316"];

interface ChartProps {
  data: {
    date: string;
    engagement: number;
    reach: number;
    followers: number;
  }[];
  title: string;
}

export function EngagementChart({ data, title }: ChartProps) {
  return (
    <Card className="glass-card border-[#1e1e2e] bg-[#0d0d1a]/50 h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#3f3f5a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#3f3f5a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d0d1a",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#a5b4fc" }}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="reach"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ fill: "#a855f7", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PlatformDistribution({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card className="glass-card border-[#1e1e2e] bg-[#0d0d1a]/50 h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Platform Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d0d1a",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 ml-4">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-medium text-[#64748b]">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
