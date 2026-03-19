import { useState } from "react";
import { cn } from "@/lib/utils";

export function SimulatorStrip() {
  const [drop, setDrop] = useState(35);

  const readoutColor =
    drop > 55 ? "text-danger" : drop > 28 ? "text-warn" : "text-accent";

  return (
    <div
      className="
      flex items-center justify-between gap-5
      px-5 py-3.5
      bg-surface border border-border rounded-md
    "
    >
      <div className="flex items-center gap-3">
        <span
          className="text-[26px] text-accent opacity-70 w-7 text-center leading-none"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          σ
        </span>
        <div>
          <p className="text-[14px] font-medium text-text">
            Position Simulator
          </p>
          <p className="text-[12px] text-text-2 mt-0.5">
            Simulate a collateral drop and watch how Guardian responds
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-[11px] text-text-3 tracking-widest uppercase">
            Collateral Drop
          </p>
          <input
            type="range"
            min={0}
            max={80}
            value={drop}
            onChange={(e) => setDrop(Number(e.target.value))}
            className="w-40 h-0.5 accent-accent cursor-pointer"
          />
        </div>

        <p
          className={cn(
            "font-mono text-[26px] min-w-14.5 text-right transition-colors",
            readoutColor,
          )}
        >
          −{drop}%
        </p>

        <button
          className="
          px-4 py-2 text-[13px] font-semibold
          bg-accent text-[#0a0e00]
          rounded-md hover:bg-[#d4f55a]
          transition-colors cursor-pointer
        "
        >
          Run
        </button>
      </div>
    </div>
  );
}
