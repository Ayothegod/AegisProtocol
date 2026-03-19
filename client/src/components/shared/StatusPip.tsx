import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/types";

interface StatusPipProps {
  status: HealthStatus | "neutral";
  className?: string;
}

const colorMap: Record<string, string> = {
  danger: "bg-danger shadow-[0_0_5px_var(--color-danger)]",
  warn: "bg-warn",
  safe: "bg-accent shadow-[0_0_5px_rgba(200,245,66,0.6)]",
  neutral: "bg-text-3",
};

export function StatusPip({ status, className }: StatusPipProps) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full shrink-0",
        colorMap[status],
        className,
      )}
    />
  );
}
