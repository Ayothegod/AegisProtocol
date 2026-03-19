import { useReactivityStore } from "@/hooks/useReactivityStore";
import { useMemo } from "react";

export function AlertFeedStats() {
  const alerts = useReactivityStore((s) => s.alerts);

  const stats = useMemo(() => {
    const fired = alerts.filter((a) => a.type === "guardian_fired").length;
    const topups = alerts.filter((a) => a.type === "topup_executed").length;
    const repays = alerts.filter((a) => a.type === "repay_executed").length;
    const breaches = alerts.filter((a) => a.type === "threshold_breach").length;

    return { fired, topups, repays, breaches };
  }, [alerts]);

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatChip
        label="Guardian Fired"
        value={stats.fired}
        color="text-danger"
        bg="bg-danger/10 border-danger/20"
      />
      <StatChip
        label="Top-ups Executed"
        value={stats.topups}
        color="text-accent"
        bg="bg-accent/10 border-accent/20"
      />
      <StatChip
        label="Repays Executed"
        value={stats.repays}
        color="text-warn"
        bg="bg-warn/10 border-warn/20"
      />
      <StatChip
        label="Threshold Breaches"
        value={stats.breaches}
        color="text-danger"
        bg="bg-surface border-border"
      />
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-md border ${bg}`}
    >
      <p className="font-mono text-[11px] text-text-3 tracking-wider uppercase">
        {label}
      </p>
      <p className={`font-mono text-[22px] leading-none ${color}`}>{value}</p>
    </div>
  );
}
