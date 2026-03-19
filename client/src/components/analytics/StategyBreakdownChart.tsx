import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ChartPanel } from "./ChartPanel";
import { ChartSkeleton } from "./SavesOverTimeChart";

const COLORS = {
  ALERT_ONLY: "#6cb6f5",
  AUTO_TOPUP: "#c8f542",
  AUTO_REPAY: "#f5a623",
};

const LABELS = {
  ALERT_ONLY: "Alert Only",
  AUTO_TOPUP: "Auto Top-up",
  AUTO_REPAY: "Auto Repay",
};

export function StrategyBreakdownChart() {
  const { data, isLoading } = useAnalytics();

  const chartData = data
    ? Object.entries(data.strategyDist)
        .map(([key, value]) => ({
          name: LABELS[key as keyof typeof LABELS],
          value,
          color: COLORS[key as keyof typeof COLORS],
        }))
        .filter((d) => d.value > 0)
    : [];

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  return (
    <ChartPanel title="Strategy Breakdown" sub="Guardian strategy distribution">
      {isLoading ? (
        <ChartSkeleton />
      ) : total === 0 ? (
        <div className="h-55 flex items-center justify-center">
          <p className="font-mono text-[12px] text-text-3">No positions yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111519",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "7px",
                  fontFamily: "DM Mono",
                  fontSize: "11px",
                  color: "#dde3e8",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* legend */}
          <div className="flex flex-col gap-1.5">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ background: d.color }}
                  />
                  <span className="font-mono text-[11px] text-text-2">
                    {d.name}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-text-3">
                  {d.value} · {Math.round((d.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartPanel>
  );
}
