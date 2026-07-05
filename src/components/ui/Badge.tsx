import type { ProjectStatus } from "@/content/schema";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ProjectStatus, { dot: string; text: string; label: string }> = {
  shipped: { dot: "bg-accent", text: "text-accent", label: "Shipped" },
  active: { dot: "bg-signal", text: "text-signal", label: "Active" },
  "in-progress": { dot: "bg-nebula-bright", text: "text-nebula-bright", label: "In progress" },
  research: { dot: "bg-dim", text: "text-dim", label: "Research" },
  archived: { dot: "bg-dim", text: "text-dim", label: "Archived" },
};

/** Project status chip with a signal dot. */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase",
        style.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden />
      {style.label}
    </span>
  );
}

/** Generic small chip (stack items, coursework, etc.). */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface/40 px-2.5 py-1 font-mono text-[11px] text-mist",
        className,
      )}
    >
      {children}
    </span>
  );
}
