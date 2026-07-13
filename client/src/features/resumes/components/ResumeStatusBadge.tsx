import { cn } from "@/lib/utils";
import type { Resume } from "../resume.types";

type ResumeStatusBadgeProps = {
  status: Resume["status"];
};

function getStatusConfig(status: Resume["status"]) {
  switch (status) {
    case "UPLOADED":
      return {
        label: "Processing",
        badgeClassName: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        dotClassName: "animate-pulse bg-blue-400",
      };

    case "EXTRACTED":
      return {
        label: "Ready",
        badgeClassName: "border-green-500/20 bg-green-500/10 text-green-300",
        dotClassName: "bg-green-400",
      };

    case "FAILED":
      return {
        label: "Failed",
        badgeClassName: "border-red-500/20 bg-red-500/10 text-red-300",
        dotClassName: "bg-red-400",
      };

    default:
      return {
        label: status,
        badgeClassName: "border-white/10 bg-white/5 text-white/60",
        dotClassName: "bg-white/40",
      };
  }
}

export function ResumeStatusBadge({ status }: ResumeStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        config.badgeClassName,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full", config.dotClassName)}
      />

      {config.label}
    </span>
  );
}
