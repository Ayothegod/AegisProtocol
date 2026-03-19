import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useAtRiskCount } from "#/hooks/useAtRistCount";

interface NavLinkProps {
  to: string;
  icon: string;
  label: string;
  badgeKey?: string;
}

export function NavLink({ to, icon, label, badgeKey }: NavLinkProps) {
  const { location } = useRouterState();
  const isActive = location.pathname === to;
  const atRisk = useAtRiskCount();

  const badge = badgeKey === "atRisk" && atRisk > 0 ? atRisk : null;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-2.5 py-2 rounded-sm",
        "text-[14px] font-normal transition-colors duration-150",
        "relative no-underline",
        isActive
          ? "bg-raised text-text font-medium"
          : "text-text-2 hover:bg-raised hover:text-text",
      )}
    >
      <span
        className={cn(
          "text-[15px] w-4.5 text-center",
          isActive ? "opacity-100" : "opacity-70",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>

      {badge && (
        <span
          className="
          font-mono text-[11px] font-medium
          px-1.5 py-0.5 rounded-full
          bg-danger-dim
          text-danger
        "
        >
          {badge}
        </span>
      )}

      {isActive && (
        <span
          className="
          absolute right-0 top-1/2 -translate-y-1/2
          w-0.5 h-3.5 rounded-l
          bg-accent
          shadow-[-2px_0_8px_rgba(200,245,66,0.4)]
        "
        />
      )}
    </Link>
  );
}
