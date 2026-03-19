import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ChartPanel } from "./ChartPanel";
import { ChartTooltip } from "./ChartTooltip";
import { ChartSkeleton } from "./SavesOverTimeChart";

export function ValueProtectedChart() {
  const { data, isLoading } = useAnalytics();

  return (
    <ChartPanel title="Value Protected" sub="Cumulative USD value safeguarded">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data?.valueOverTime ?? []}
            margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
          >
            <defs>
              <linearGradient id="gradValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c8f542" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#c8f542" stopOpacity={0} />
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
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<ChartTooltip valuePrefix="$" />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#c8f542"
              strokeWidth={1.5}
              fill="url(#gradValue)"
              dot={false}
              name="Value Protected"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}
