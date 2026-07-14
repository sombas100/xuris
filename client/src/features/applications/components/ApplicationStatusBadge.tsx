import { cn } from "@/lib/utils";

import type { ApplicationStatus } from "../application.types";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  SAVED: {
    label: "Saved",
    className: "border-slate-500/20 bg-slate-500/10 text-slate-300",
    dotClassName: "bg-slate-400",
  },

  APPLIED: {
    label: "Applied",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    dotClassName: "bg-blue-400",
  },

  SCREENING: {
    label: "Screening",
    className: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    dotClassName: "bg-cyan-400",
  },

  INTERVIEW: {
    label: "Interview",
    className: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    dotClassName: "bg-purple-400",
  },

  TECHNICAL_TEST: {
    label: "Technical test",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    dotClassName: "bg-violet-400",
  },

  FINAL_INTERVIEW: {
    label: "Final interview",
    className: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
    dotClassName: "bg-fuchsia-400",
  },

  OFFER: {
    label: "Offer",
    className: "border-green-500/20 bg-green-500/10 text-green-300",
    dotClassName: "bg-green-400",
  },

  REJECTED: {
    label: "Rejected",
    className: "border-red-500/20 bg-red-500/10 text-red-300",
    dotClassName: "bg-red-400",
  },

  WITHDRAWN: {
    label: "Withdrawn",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-300",
    dotClassName: "bg-orange-400",
  },
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        config.className,
      )}
    >
      <span className={cn("size-2 rounded-full", config.dotClassName)} />

      {config.label}
    </span>
  );
}
