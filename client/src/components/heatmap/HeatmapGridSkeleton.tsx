const SKELETON_COUNT = 40;

export function HeatmapGridSkeleton() {
  return (
    <div
      className="grid gap-2 animate-pulse"
      style={{ gridTemplateColumns: "repeat(10, 1fr)" }}
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded bg-raised"
          style={{ opacity: Math.random() * 0.5 + 0.2 }}
        />
      ))}
    </div>
  );
}
