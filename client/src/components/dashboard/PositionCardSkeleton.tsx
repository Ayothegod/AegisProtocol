export function PositionCardSkeleton() {
  return (
    <div className="p-3.5 bg-bg border border-border rounded-sm animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-32 bg-raised rounded" />
        <div className="h-5 w-20 bg-raised rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-1 mb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-14 bg-raised rounded mb-1" />
            <div className="h-4 w-20 bg-raised rounded" />
          </div>
        ))}
      </div>
      <div className="h-1.5 w-full bg-raised rounded" />
    </div>
  );
}
