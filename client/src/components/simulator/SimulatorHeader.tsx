export function SimulatorHeader() {
  return (
    <div>
      <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
        Guardian · Tools
      </p>
      <h1 className="text-[36px] leading-none tracking-tight text-text font-serif italic">
        Position <em className="text-accent">simulator.</em>
      </h1>
      <p className="text-[13px] text-text-2 mt-2 max-w-lg">
        Simulate a collateral drop or debt increase and see exactly how Guardian
        would respond — before it happens on-chain.
      </p>
    </div>
  );
}
