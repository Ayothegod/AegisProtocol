import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ChartPanel } from "./ChartPanel";
import { ChartTooltip } from "./ChartTooltip";
import { ChartSkeleton } from "./SavesOverTimeChart";

export function HealthDistributionChart() {
  const { data, isLoading } = useAnalytics();

  const chartData = data
    ? [
        { label: "Safe", value: data.healthDist.safe, fill: "#c8f542" },
        { label: "Warning", value: data.healthDist.warn, fill: "#f5a623" },
        { label: "Danger", value: data.healthDist.danger, fill: "#f54242" },
      ]
    : [];

  return (
    <ChartPanel
      title="Health Distribution"
      sub="Current status across all positions"
    >
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#3d4a56", fontSize: 11, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#3d4a56", fontSize: 10, fontFamily: "DM Mono" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Positions">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartPanel>
  );
}
