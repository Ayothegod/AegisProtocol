import { RegisterPositionModal } from "./RegisterPositionModel";

export function PositionsHeader() {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
          Guardian · Positions
        </p>
        <h1
          className="text-[36px] leading-none tracking-tight text-text"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Your{" "}
          <em className="text-accent" style={{ fontStyle: "italic" }}>
            monitored
          </em>{" "}
          positions.
        </h1>
      </div>
      <RegisterPositionModal />
    </div>
  );
}
