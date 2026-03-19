import { cn } from "@/lib/utils";
import type { Position } from "@/types";

interface HeatmapRiskSummaryProps {
  positions: Position[];
}

export function HeatmapRiskSummary({ positions }: HeatmapRiskSummaryProps) {
  const total = positions.length;
  const safe = positions.filter((p) => p.status === "safe").length;
  const warn = positions.filter((p) => p.status === "warn").length;
  const danger = positions.filter((p) => p.status === "danger").length;

  const safePct = total ? Math.round((safe / total) * 100) : 0;
  const warnPct = total ? Math.round((warn / total) * 100) : 0;
  const dangerPct = total ? Math.round((danger / total) * 100) : 0;

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Risk Summary</p>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* stacked bar */}
        <div className="h-2 rounded-full overflow-hidden flex gap-px">
          {safe > 0 && (
            <div className="bg-accent" style={{ width: `${safePct}%` }} />
          )}
          {warn > 0 && (
            <div className="bg-warn" style={{ width: `${warnPct}%` }} />
          )}
          {danger > 0 && (
            <div className="bg-danger" style={{ width: `${dangerPct}%` }} />
          )}
          {total === 0 && <div className="bg-raised w-full" />}
        </div>

        {/* breakdown */}
        <div className="flex flex-col gap-2">
          <RiskRow
            label="Safe"
            count={safe}
            pct={safePct}
            color="text-accent"
            barColor="bg-accent"
          />
          <RiskRow
            label="Warning"
            count={warn}
            pct={warnPct}
            color="text-warn"
            barColor="bg-warn"
          />
          <RiskRow
            label="Danger"
            count={danger}
            pct={dangerPct}
            color="text-danger"
            barColor="bg-danger"
          />
        </div>

        {/* overall risk score */}
        <div className="pt-3 border-t border-border">
          <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase mb-2">
            Portfolio Risk Score
          </p>
          <p
            className={cn(
              "font-mono text-[28px] leading-none font-medium",
              danger > 0
                ? "text-danger"
                : warn > 0
                  ? "text-warn"
                  : "text-accent",
            )}
          >
            {total === 0
              ? "—"
              : danger > 0
                ? "High"
                : warn > 0
                  ? "Medium"
                  : "Low"}
          </p>
          <p className="font-mono text-[11px] text-text-3 mt-1">
            {danger > 0
              ? `${danger} position${danger > 1 ? "s" : ""} need immediate attention`
              : warn > 0
                ? `${warn} position${warn > 1 ? "s" : ""} approaching threshold`
                : "All positions within safe range"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskRow({
  label,
  count,
  pct,
  color,
  barColor,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
  barColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("font-mono text-[12px] w-16", color)}>{label}</span>
      <div className="flex-1 h-1 bg-raised rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            barColor,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[11px] text-text-3 w-12 text-right">
        {count} · {pct}%
      </span>
    </div>
  );
}
