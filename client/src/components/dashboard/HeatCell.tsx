import { cn } from "@/lib/utils";
import { formatHealthFactor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Position } from "@/types";

interface HeatCellProps {
  position: Position | null;
}

const cellStyleMap = {
  safe_high: "bg-accent opacity-75",
  safe_low: "bg-accent opacity-30",
  warn_high: "bg-warn opacity-55",
  warn_low: "bg-warn opacity-28",
  danger: "bg-danger opacity-75",
  empty: "bg-border-hi opacity-50",
};

function getCellStyle(position: Position | null): string {
  if (!position) return cellStyleMap.empty;
  const hf = Number(position.healthFactor) / 1e18;
  if (hf >= 2.0) return cellStyleMap.safe_high;
  if (hf >= 1.5) return cellStyleMap.safe_low;
  if (hf >= 1.35) return cellStyleMap.warn_high;
  if (hf >= 1.2) return cellStyleMap.warn_low;
  return cellStyleMap.danger;
}

export function HeatCell({ position }: HeatCellProps) {
  const cell = (
    <div
      className={cn(
        "aspect-square rounded cursor-pointer",
        "transition-transform duration-150",
        "hover:scale-125 hover:z-10",
        getCellStyle(position),
      )}
    />
  );

  if (!position) return cell;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent className="bg-raised border border-border-hi text-text font-mono text-[11px]">
        <p>#{position.id.toString()}</p>
        <p className="text-text-2">
          {formatHealthFactor(position.healthFactor)}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
