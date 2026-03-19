import { cn, formatHealthFactor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Position } from "@/types";

interface HeatmapCellProps {
  position: Position | null;
  isSelected: boolean;
  onSelect: (p: Position | null) => void;
}

function getCellStyle(position: Position | null): string {
  if (!position) return "bg-border-hi opacity-40";
  const hf = Number(position.healthFactor) / 1e18;
  if (hf >= 2.5) return "bg-accent opacity-90";
  if (hf >= 2.0) return "bg-accent opacity-65";
  if (hf >= 1.5) return "bg-accent opacity-35";
  if (hf >= 1.35) return "bg-warn opacity-60";
  if (hf >= 1.2) return "bg-warn opacity-35";
  if (hf >= 1.1) return "bg-danger opacity-60";
  return "bg-danger opacity-90";
}

export function HeatmapCell({
  position,
  isSelected,
  onSelect,
}: HeatmapCellProps) {
  const cell = (
    <div
      onClick={() => onSelect(isSelected ? null : position)}
      className={cn(
        "aspect-square rounded cursor-pointer",
        "transition-all duration-150",
        "hover:scale-125 hover:z-10 hover:opacity-100",
        isSelected && "ring-2 ring-white/40 scale-110 z-10",
        getCellStyle(position),
      )}
    />
  );

  if (!position)
    return <div className={cn("aspect-square rounded", getCellStyle(null))} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent className="bg-raised border border-border-hi p-3 rounded-md">
        <p className="font-mono text-[12px] text-text font-medium mb-1">
          #{position.id.toString()}
        </p>
        <p
          className={cn(
            "font-mono text-[13px] font-semibold",
            position.status === "danger"
              ? "text-danger"
              : position.status === "warn"
                ? "text-warn"
                : "text-accent",
          )}
        >
          {formatHealthFactor(position.healthFactor)}
        </p>
        <p className="font-mono text-[10px] text-text-3 mt-1 capitalize">
          {position.status} ·{" "}
          {position.strategy.replace("_", " ").toLowerCase()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
