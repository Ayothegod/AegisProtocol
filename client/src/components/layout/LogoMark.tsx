export function LogoMark() {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-accent text-[21px] leading-none"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        Lg
      </span>
      <div className="w-px h-3.5 bg-border-hi" />
      <span className="text-[15px] font-medium text-text tracking-tight">
        Liquidation Guardian
      </span>
    </div>
  );
}
