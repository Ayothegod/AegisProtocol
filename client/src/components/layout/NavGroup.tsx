import { NavLink } from "./NavLink";

interface NavGroupProps {
  label: string;
  links: {
    to: string;
    icon: string;
    label: string;
    badgeKey?: string;
  }[];
}

export function NavGroup({ label, links }: NavGroupProps) {
  return (
    <div>
      <p
        className="
        px-2 mb-1.5
        text-[11px] font-semibold
        tracking-[0.14em] uppercase
        text-text-3
      "
      >
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {links.map((link) => (
          <NavLink key={link.to} {...link} />
        ))}
      </div>
    </div>
  );
}
