export function AnalyticsHeader() {
  return (
    <div>
      <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
        Guardian · Insights
      </p>
      <h1
        className="text-[36px] leading-none tracking-tight text-text"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        Protocol{" "}
        <em className="text-accent" style={{ fontStyle: "italic" }}>
          analytics.
        </em>
      </h1>
      <p className="text-[13px] text-text-2 mt-2">
        All-time performance of Liquidation Guardian across your positions.
      </p>
    </div>
  );
}
