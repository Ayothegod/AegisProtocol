import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./ChartPanel";
import { ChartTooltip } from "./ChartTooltip";

export function SavesOverTimeChart() {
  const { data, isLoading } = useAnalytics();

  return (
    <ChartPanel title="Guardian Actions Over Time" sub="Last 14 days">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data?.savesOverTime ?? []}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="gradSaves" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c8f542" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c8f542" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradTopups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5a623" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#3d4a56", fontSize: 10, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#3d4a56", fontSize: 10, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />

            <Area
              type="monotone"
              dataKey="saves"
              stroke="#c8f542"
              strokeWidth={1.5}
              fill="url(#gradSaves)"
              dot={false}
              name="Saves"
            />
            <Area
              type="monotone"
              dataKey="topups"
              stroke="#f5a623"
              strokeWidth={1.5}
              fill="url(#gradTopups)"
              dot={false}
              name="Top-ups"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}

export function ChartSkeleton() {
  return <div className="h-55 bg-raised rounded animate-pulse" />;
}
