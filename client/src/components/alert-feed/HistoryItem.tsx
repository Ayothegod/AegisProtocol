import { cn, timeAgo } from "@/lib/utils";
import type { GuardianHistoryItem } from "@/types";

interface HistoryItemProps {
  item: GuardianHistoryItem;
}

const actionConfig: Record<
  GuardianHistoryItem["action"],
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  alert: { label: "Alert", color: "text-text-2", icon: "◎" },
  topup: { label: "Top-up", color: "text-accent", icon: "↑" },
  repay: { label: "Repay", color: "text-warn", icon: "↓" },
};

export function HistoryItem({ item }: HistoryItemProps) {
  const config = actionConfig[item.action];

  return (
    <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-raised transition-colors">
      {/* action icon */}
      <span
        className={cn(
          "font-mono text-[14px] mt-0.5 shrink-0 w-4 text-center",
          config.color,
        )}
      >
        {config.icon}
      </span>

      <div className="flex-1 min-w-0">
        {/* top row */}
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[13px] font-medium text-text">
            <span className={config.color}>{config.label}</span> · #
            {item.positionId.toString()}
          </p>
          <p className="font-mono text-[10px] text-text-3 shrink-0 ml-2">
            {timeAgo(item.timestamp)}
          </p>
        </div>

        {/* detail */}
        <p className="font-mono text-[11px] text-text-3 truncate">
          {item.detail}
        </p>

        {/* tx hash */}
        <a
          href={`https://shannon-explorer.somnia.network/tx/${item.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="
            font-mono text-[10px] text-text-3
            hover:text-accent transition-colors
            truncate block mt-1
          "
        >
          {item.txHash.slice(0, 20)}…
        </a>
      </div>
    </div>
  );
}
