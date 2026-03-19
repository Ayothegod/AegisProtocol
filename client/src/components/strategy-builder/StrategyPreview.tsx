import { cn } from "@/lib/utils";
import { StrategyBadge } from "@/components/shared/StrategyBadge";
import { useStrategyBuilder } from "@/hooks/useStrategyBuilder";
import { usePositions } from "@/hooks/usePositions";
import { StrategyPreviewCard } from "./StrategyPreviewCard";
import { StrategyFlowDiagram } from "./StrategyFlowDiagram";

export function StrategyPreview() {
  const { data: positions = [] } = usePositions();
  const builder = useStrategyBuilder();

  return (
    <div className="flex flex-col gap-4">
      {/* preview card */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-text">
            Strategy Preview
          </p>
          <p className="font-mono text-[11px] text-text-3 mt-0.5">
            What Guardian will do when triggered
          </p>
        </div>

        <div className="p-5">
          {!builder.selectedPosition ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-text-3">
                Select a position to preview its strategy
              </p>
            </div>
          ) : (
            <StrategyPreviewCard
              position={builder.selectedPosition}
              draft={builder.draft}
            />
          )}
        </div>
      </div>

      {/* flow diagram */}
      {builder.selectedPosition && (
        <StrategyFlowDiagram draft={builder.draft} />
      )}

      {/* all positions summary */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-text">All Strategies</p>
        </div>
        <div className="divide-y divide-border">
          {positions.map((p) => (
            <div
              key={p.id.toString()}
              className="flex items-center justify-between px-5 py-3 hover:bg-raised transition-colors"
            >
              <span className="font-mono text-[12px] text-text-2">
                #{p.id.toString()}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    p.status === "danger"
                      ? "text-danger"
                      : p.status === "warn"
                        ? "text-warn"
                        : "text-accent",
                  )}
                >
                  {(Number(p.threshold) / 100).toFixed(2)}× trigger
                </span>
                <StrategyBadge strategy={p.strategy} />
              </div>
            </div>
          ))}
          {positions.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-[12px] text-text-3">No positions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
