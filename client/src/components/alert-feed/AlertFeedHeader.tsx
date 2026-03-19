import { useReactivityStore } from "@/hooks/useReactivityStore";
import { cn } from "@/lib/utils";

export function AlertFeedHeader() {
  const isConnected = useReactivityStore((s) => s.isConnected);
  const alerts = useReactivityStore((s) => s.alerts);

  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
          Guardian · Reactivity
        </p>
        <h1
          className="text-[36px] leading-none tracking-tight text-text"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Live{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            event
          </em>{" "}
          feed.
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* event counter */}
        <div
          className="
          px-4 py-2
          bg-surface border border-border rounded-md
          font-mono text-[12px] text-text-2
        "
        >
          <span className="text-accent">{alerts.length}</span> events received
        </div>

        {/* connection status */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md border text-[12px] font-medium",
            isConnected
              ? "bg-accent/10 border-accent/25 text-accent"
              : "bg-danger/10 border-danger/25 text-danger",
          )}
        >
          <span
            className={cn(
              "w-1.25 h-1.25 rounded-full",
              isConnected
                ? "bg-accent shadow-[0_0_6px_var(--color-accent)] animate-pulse"
                : "bg-danger",
            )}
          />
          {isConnected ? "Somnia Reactivity Connected" : "Disconnected"}
        </div>
      </div>
    </div>
  );
}
