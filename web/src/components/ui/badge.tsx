import { cn } from "@/lib/utils";
import { GenerationStatus } from "@/types";

const STATUS_STYLES: Record<GenerationStatus, string> = {
  pending:    "bg-white/10 text-white/50",
  queued:     "bg-blue-500/20 text-blue-300",
  processing: "bg-amber-500/20 text-amber-300",
  uploading:  "bg-purple-500/20 text-purple-300",
  completed:  "bg-emerald-500/20 text-emerald-300",
  failed:     "bg-red-500/20 text-red-300",
};

const STATUS_LABELS: Record<GenerationStatus, string> = {
  pending:    "Pending",
  queued:     "Queued",
  processing: "Generating",
  uploading:  "Uploading",
  completed:  "Done",
  failed:     "Failed",
};

export function StatusBadge({ status }: { status: GenerationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StyleBadge({ style }: { style: string }) {
  if (style === "none") return null;
  const labels: Record<string, string> = {
    cinematic:   "Cinematic",
    render_3d:   "3D Render",
    documentary: "Documentary",
  };
  return (
    <span className="inline-flex items-center rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
      {labels[style] ?? style}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60",
        className,
      )}
    >
      {children}
    </span>
  );
}
