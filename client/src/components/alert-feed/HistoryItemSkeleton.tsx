export function HistoryItemSkeleton() {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5 animate-pulse">
      <div className="w-4 h-4 bg-raised rounded mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between mb-1.5">
          <div className="h-4 w-28 bg-raised rounded" />
          <div className="h-3 w-10 bg-raised rounded" />
        </div>
        <div className="h-3 w-full bg-raised rounded mb-1" />
        <div className="h-3 w-32 bg-raised rounded" />
      </div>
    </div>
  );
}
