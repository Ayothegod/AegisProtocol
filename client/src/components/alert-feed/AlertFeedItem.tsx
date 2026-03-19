import { cn, timeAgo } from "@/lib/utils";
import type { AlertEvent } from "@/types";

interface AlertFeedItemProps {
  alert: AlertEvent;
}

const typeConfig: Record<
  AlertEvent["type"],
  {
    strong: string;
    color: string;
    bg: string;
    icon: string;
  }
> = {
  guardian_fired: {
    strong: "Guardian Fired",
    color: "text-danger",
    bg: "bg-danger/5",
    icon: "⚡",
  },
  topup_executed: {
    strong: "Top-up Executed",
    color: "text-accent",
    bg: "bg-accent/5",
    icon: "↑",
  },
  repay_executed: {
    strong: "Repay Executed",
    color: "text-warn",
    bg: "bg-warn/5",
    icon: "↓",
  },
  threshold_breach: {
    strong: "Threshold Breach",
    color: "text-danger",
    bg: "bg-danger/5",
    icon: "!",
  },
  registered: {
    strong: "Position Registered",
    color: "text-text-2",
    bg: "bg-transparent",
    icon: "+",
  },
};

export function AlertFeedItem({ alert }: AlertFeedItemProps) {
  const config = typeConfig[alert.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-5 py-3.5",
        "transition-colors duration-150 hover:bg-raised",
        config.bg,
      )}
    >
      {/* icon */}
      <div
        className="
        w-7 h-7 shrink-0 flex items-center justify-center
        bg-raised border border-border rounded-sm
        font-mono text-[12px] text-text-2 mt-0.5
      "
      >
        {config.icon}
      </div>

      {/* body */}
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] text-text leading-snug mb-1">
          <strong className={config.color}>{config.strong}</strong> on position{" "}
          <span className="font-mono text-text-2">
            #{alert.positionId.toString()}
          </span>
        </p>

        <p className="font-mono text-[11px] text-text-3 truncate mb-1.5">
          {alert.detail}
        </p>

        {/* tags */}
        <div className="flex items-center gap-2">
          <span
            className="
            font-mono text-[10px] px-2 py-0.5
            bg-raised border border-border rounded-full
            text-text-3
          "
          >
            Block #{Math.floor(Math.random() * 1000000 + 4000000)}
          </span>
          <span
            className={cn(
              "font-mono text-[10px] px-2 py-0.5 rounded-full border",
              alert.type === "guardian_fired" ||
                alert.type === "threshold_breach"
                ? "bg-danger/10 border-danger/20 text-danger"
                : alert.type === "registered"
                  ? "bg-surface border-border text-text-3"
                  : "bg-accent/10 border-accent/20 text-accent",
            )}
          >
            {alert.type.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* timestamp */}
      <div className="shrink-0 text-right">
        <p className="font-mono text-[11px] text-text-3">
          {timeAgo(alert.timestamp)}
        </p>
      </div>
    </div>
  );
}
