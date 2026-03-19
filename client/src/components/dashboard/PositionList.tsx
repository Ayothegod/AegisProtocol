import { usePositions } from "@/hooks/usePositions";
import { useAtRiskCount } from "#/hooks/useAtRistCount";
import { PositionCard } from "./PositionCard";
import { PositionCardSkeleton } from "./PositionCardSkeleton";

export function PositionList() {
  const { data: positions = [], isLoading } = usePositions();
  const atRisk = useAtRiskCount();

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Active Positions</p>
        <p className="font-mono text-[12px] text-text-3">
          {positions.length} monitored · {atRisk} at risk
        </p>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <PositionCardSkeleton key={i} />
          ))
        ) : positions.length === 0 ? (
          <EmptyPositions />
        ) : (
          positions.map((p) => (
            <PositionCard key={p.id.toString()} position={p} />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyPositions() {
  return (
    <div className="py-12 text-center">
      <p className="text-[13px] text-text-3">No positions registered yet</p>
      <p className="text-[12px] text-text-3 mt-1 font-mono">
        Register your first position to start monitoring
      </p>
    </div>
  );
}
