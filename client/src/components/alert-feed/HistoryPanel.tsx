import { useGuardianHistory } from "#/hooks/useGuardianHistory";
import { HistoryItem } from "./HistoryItem";
import { HistoryItemSkeleton } from "./HistoryItemSkeleton";

export function HistoryPanel() {
  const { data: history = [], isLoading } = useGuardianHistory();

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Guardian History</p>
        <p className="font-mono text-[12px] text-text-3">On-chain log</p>
      </div>

      <div className="flex-1 divide-y divide-border overflow-y-auto max-h-170">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <HistoryItemSkeleton key={i} />
          ))
        ) : history.length === 0 ? (
          <EmptyHistory />
        ) : (
          history.map((item, i) => <HistoryItem key={i} item={item} />)
        )}
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="py-16 text-center px-5">
      <p className="text-[13px] text-text-3">No Guardian actions yet</p>
      <p className="font-mono text-[11px] text-text-3 mt-1">
        Actions will be logged here as Guardian fires
      </p>
    </div>
  );
}
