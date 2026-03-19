export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-16 shrink-0">
        <div className="h-5 w-8 bg-raised rounded" />
      </div>
      <div className="w-40 shrink-0">
        <div className="h-4 w-24 bg-raised rounded mb-1" />
        <div className="h-3 w-20 bg-raised rounded" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-24 shrink-0">
          <div className="h-6 w-12 bg-raised rounded mb-1" />
          <div className="h-3 w-8 bg-raised rounded" />
        </div>
      ))}
      <div className="flex-1">
        <div className="h-5 w-20 bg-raised rounded mb-1" />
        <div className="h-3 w-14 bg-raised rounded" />
      </div>
    </div>
  );
}
