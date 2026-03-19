export function PositionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-32 shrink-0">
        <div className="h-4 w-20 bg-raised rounded mb-1" />
        <div className="h-3 w-16 bg-raised rounded" />
      </div>
      <div className="w-36 shrink-0">
        <div className="h-4 w-24 bg-raised rounded" />
      </div>
      <div className="w-36 shrink-0">
        <div className="h-4 w-24 bg-raised rounded" />
      </div>
      <div className="w-24 shrink-0">
        <div className="h-4 w-12 bg-raised rounded" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 w-20 bg-raised rounded" />
          <div className="h-3 w-10 bg-raised rounded" />
        </div>
        <div className="h-0.75 w-full bg-raised rounded" />
      </div>
      <div className="w-36 shrink-0">
        <div className="h-6 w-24 bg-raised rounded-full" />
      </div>
      <div className="w-24 shrink-0">
        <div className="h-4 w-16 bg-raised rounded" />
      </div>
      <div className="w-24 shrink-0 flex justify-end">
        <div className="h-7 w-16 bg-raised rounded" />
      </div>
    </div>
  );
}
