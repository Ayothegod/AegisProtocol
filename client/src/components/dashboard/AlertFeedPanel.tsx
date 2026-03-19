import { cn } from "@/lib/utils";
import { useReactivityStore } from "@/hooks/useReactivityStore";
import { AlertRow } from "./AlertRow";

export function AlertFeedPanel() {
  const alerts = useReactivityStore((s) => s.alerts);
  const isConnected = useReactivityStore((s) => s.isConnected);

  return (
    <div className="flex-1 bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <p className="text-[14px] font-semibold text-text">Alert Feed</p>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent uppercase tracking-widest">
          <span
            className={cn(
              "w-1.25 h-1.25 rounded-full bg-accent",
              isConnected
                ? "shadow-[0_0_5px_var(--color-accent)] animate-pulse"
                : "opacity-30",
            )}
          />
          {isConnected ? "Live" : "Offline"}
        </div>
      </div>

      <div className="px-5 divide-y divide-border">
        {alerts.length === 0 ? (
          <EmptyFeed />
        ) : (
          alerts
            .slice(0, 8)
            .map((alert) => <AlertRow key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="py-10 text-center">
      <p className="text-[13px] text-text-3">Waiting for Guardian events…</p>
    </div>
  );
}
