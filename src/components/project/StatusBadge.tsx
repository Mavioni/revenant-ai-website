import type { ProjectStatus } from "../../data/projects";

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const STATUS_META: Record<
  ProjectStatus,
  { label: string; dotColor: string; bg: string; fg: string }
> = {
  shipping: {
    label: "Shipping",
    dotColor: "#00D4AA",
    bg: "bg-[#00D4AA]/10",
    fg: "text-[#00D4AA]",
  },
  alpha: {
    label: "Alpha",
    dotColor: "#F59E0B",
    bg: "bg-[#F59E0B]/10",
    fg: "text-[#F59E0B]",
  },
  "private-beta": {
    label: "Private Beta",
    dotColor: "#ea0000",
    bg: "bg-highlight/10",
    fg: "text-highlight",
  },
  concept: {
    label: "Concept",
    dotColor: "#7C3AED",
    bg: "bg-[#7C3AED]/15",
    fg: "text-[#7C3AED]",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-body-sm uppercase tracking-widest ${meta.bg} ${meta.fg} ${className}`}
      aria-label={`Status: ${meta.label}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: meta.dotColor,
          boxShadow: `0 0 8px ${meta.dotColor}`,
        }}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}
