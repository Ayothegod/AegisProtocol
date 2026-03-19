import { useGuardianActive } from "@/hooks/useGuardianActive";

export function GuardianStatus() {
  const isActive = useGuardianActive();

  if (!isActive) return null;

  return (
    <div
      className="
      flex items-center gap-1.5 px-3 py-1
      bg-accent-dim
      border border-accent-mid
      rounded-full
      text-[12px] font-semibold text-accent
      tracking-wider uppercase
    "
    >
      <span
        className="
        w-1.25 h-1.25 rounded-full
        bg-accent shadow-[0_0_6px_var(--color-accent)]
        animate-pulse
      "
      />
      Guardian Active
    </div>
  );
}
