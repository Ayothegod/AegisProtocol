import { useState, useMemo } from "react";
import { useReactivityStore } from "@/hooks/useReactivityStore";
import type { AlertFilter } from "./AlertFeedControls";
import { AlertFeedItem } from "./AlertFeedItem";
import { AlertFeedControls } from "./AlertFeedControls";

export function AlertFeedList() {
  const alerts = useReactivityStore((s) => s.alerts);
  const clearAlerts = useReactivityStore((s) => s.clearAlerts);

  const [filter, setFilter] = useState<AlertFilter>("all");
  const [paused, setPaused] = useState(false);
  const [frozen, setFrozen] = useState<typeof alerts>([]);

  function handlePause() {
    if (!paused) setFrozen(alerts);
    setPaused((p) => !p);
  }

  const displayed = paused ? frozen : alerts;

  const filtered = useMemo(() => {
    if (filter === "all") return displayed;
    return displayed.filter((a) => a.type === filter);
  }, [displayed, filter]);

  return (
    <div className="flex flex-col gap-3">
      <AlertFeedControls
        filter={filter}
        onFilter={setFilter}
        paused={paused}
        onPause={handlePause}
        onClear={clearAlerts}
      />

      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <p className="text-[14px] font-semibold text-text">Event Stream</p>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent uppercase tracking-widest">
            {paused ? (
              <span className="text-warn">⏸ Paused</span>
            ) : (
              <>
                <span className="w-1.25 h-1.25 rounded-full bg-accent shadow-[0_0_5px_var(--color-accent)] animate-pulse" />
                Live
              </>
            )}
          </div>
        </div>

        <div className="divide-y divide-border max-h-150 overflow-y-auto">
          {filtered.length === 0 ? (
            <EmptyFeed paused={paused} />
          ) : (
            filtered.map((alert) => (
              <AlertFeedItem key={alert.id} alert={alert} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyFeed({ paused }: { paused: boolean }) {
  return (
    <div className="py-20 text-center">
      <p className="text-[13px] text-text-3">
        {paused
          ? "Feed paused — no events captured"
          : "Waiting for Guardian events…"}
      </p>
      <p className="font-mono text-[11px] text-text-3 mt-1">
        {paused
          ? "Resume to start capturing again"
          : "Events will appear here in real time"}
      </p>
    </div>
  );
}
