import { StatusPip } from "@/components/shared/StatusPip";
import { timeAgo } from "@/lib/utils";
import type { AlertEvent } from "@/types";

interface AlertRowProps {
  alert: AlertEvent;
}

const messageMap: Record<
  AlertEvent["type"],
  { strong: string; color: string }
> = {
  guardian_fired: { strong: "Guardian fired", color: "text-danger" },
  topup_executed: { strong: "Top-up executed", color: "text-accent" },
  repay_executed: { strong: "Repay executed", color: "text-warn" },
  threshold_breach: { strong: "Threshold breach", color: "text-danger" },
  registered: { strong: "Position registered", color: "text-text-2" },
};

export function AlertRow({ alert }: AlertRowProps) {
  const meta = messageMap[alert.type];

  return (
    <div className="flex items-start gap-2.5 py-3">
      <StatusPip status={alert.status} className="mt-1" />

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-text leading-snug mb-0.5">
          <strong className={meta.color}>{meta.strong}</strong> on #
          {alert.positionId.toString()}
        </p>
        <p className="font-mono text-[11px] text-text-3 truncate">
          {alert.detail}
        </p>
      </div>

      <p className="font-mono text-[11px] text-text-3 whitespace-nowrap mt-0.5">
        {timeAgo(alert.timestamp)}
      </p>
    </div>
  );
}
