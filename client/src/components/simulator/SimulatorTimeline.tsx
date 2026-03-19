import { cn } from "@/lib/utils";
import type { SimulatorState } from "@/hooks/useSimulator";

interface SimulatorTimelineProps {
  sim: SimulatorState;
}

export function SimulatorTimeline({ sim }: SimulatorTimelineProps) {
  const { steps } = sim;

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">
          Simulation Timeline
        </p>
        <p className="font-mono text-[11px] text-text-3 mt-0.5">
          Step-by-step execution trace
        </p>
      </div>

      <div className="p-5">
        <div className="relative">
          {/* vertical line */}
          <div
            className="
            absolute left-2.75 top-3 bottom-3
            w-px bg-border
          "
          />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <TimelineStep
                key={i}
                step={step}
                index={i}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  index,
  isLast,
  step,
}: {
  step: import("@/hooks/useSimulator").SimStep;
  index: number;
  isLast: boolean;
}) {
  const dotColor = step.guardianFired
    ? "bg-danger shadow-[0_0_8px_var(--color-danger)]"
    : step.status === "warn"
      ? "bg-warn"
      : step.status === "safe"
        ? "bg-accent"
        : "bg-danger";

  const hfColor =
    step.status === "danger"
      ? "text-danger"
      : step.status === "warn"
        ? "text-warn"
        : "text-accent";

  return (
    <div
      className={cn("flex gap-4 pb-5 last:pb-0", "animate-[up_0.3s_ease_both]")}
    >
      {/* dot */}
      <div className="shrink-0 flex flex-col items-center">
        <div
          className={cn(
            "w-5.5 h-5.5 rounded-full border-2 border-bg flex items-center justify-center z-10",
            dotColor,
          )}
        >
          <span className="font-mono text-[9px] text-bg font-bold">
            {index + 1}
          </span>
        </div>
      </div>

      {/* content */}
      <div
        className={cn(
          "flex-1 pb-5 last:pb-0",
          !isLast && "border-b border-border",
        )}
      >
        <div className="flex items-start justify-between mb-1">
          <p className="text-[13px] font-medium text-text">{step.label}</p>
          <p className={cn("font-mono text-[14px] font-semibold", hfColor)}>
            {step.healthFactor.toFixed(2)}×
          </p>
        </div>

        {step.event && (
          <p
            className={cn(
              "font-mono text-[11px] mt-1 px-2 py-1 rounded-sm border",
              step.guardianFired
                ? "bg-danger/10 border-danger/25 text-danger"
                : "bg-raised border-border text-text-3",
            )}
          >
            {step.guardianFired ? "⚡ " : "→ "}
            {step.event}
          </p>
        )}
      </div>
    </div>
  );
}
