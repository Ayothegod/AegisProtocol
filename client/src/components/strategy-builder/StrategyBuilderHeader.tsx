export function StrategyBuilderHeader() {
  return (
    <div>
      <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
        Guardian · Configuration
      </p>
      <h1
        className="text-[36px] leading-none tracking-tight text-text"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        Build your{" "}
        <em className="text-accent" style={{ fontStyle: "italic" }}>
          strategy.
        </em>
      </h1>
      <p className="text-[13px] text-text-2 mt-2 max-w-lg">
        Configure exactly how Guardian protects each position. Set thresholds,
        choose actions, and define rules — all enforced on-chain via Somnia
        reactivity.
      </p>
    </div>
  );
}
