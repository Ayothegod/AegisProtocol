import { NavGroup } from "./NavGroup";
import { SomBalance } from "#/components/shared/SomBalance";

const navGroups = [
  {
    label: "Monitor",
    links: [
      { to: "/", icon: "◈", label: "Dashboard" },
      { to: "/positions", icon: "⬡", label: "Positions", badgeKey: "atRisk" },
      { to: "/alert-feed", icon: "◎", label: "Alert Feed" },
    ],
  },
  {
    label: "Guardian",
    links: [
      { to: "/strategy-builder", icon: "⊕", label: "Strategy Builder" },
      { to: "/history", icon: "◷", label: "History Log" },
    ],
  },
  {
    label: "Insights",
    links: [
      { to: "/heatmap", icon: "▦", label: "Risk Heatmap" },
      { to: "/analytics", icon: "∿", label: "Analytics" },
      { to: "/leaderboard", icon: "⊞", label: "Leaderboard" },
    ],
  },
  {
    label: "Tools",
    links: [
      { to: "/simulator", icon: "⚗", label: "Simulator" },
      { to: "/settings", icon: "◉", label: "Settings" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside
      className="
      w-55 shrink-0
      flex flex-col gap-6
      px-2.5 py-4
      border-r border-border
      bg-[rgba(7,9,11,0.5)]
      relative
    "
    >
      <div className="flex flex-col gap-6 flex-1">
        {navGroups.map((group) => (
          <NavGroup key={group.label} {...group} />
        ))}
      </div>
      <SomBalance />
    </aside>
  );
}
