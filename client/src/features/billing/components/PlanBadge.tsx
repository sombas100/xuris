import { Crown, Sparkles } from "lucide-react";

import type { Plan } from "../billing.types";

type PlanBadgeProps = {
  plan: Plan;
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  const isPaid = plan === "PRO" || plan === "TEAM";

  const Icon = isPaid ? Crown : Sparkles;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[10px] font-semibold uppercase tracking-[0.16em]",
        isPaid
          ? "border-primary/25 bg-primary/10 text-primary"
          : "border-white/10 bg-white/4 text-white/45",
      ].join(" ")}
    >
      <Icon className="size-3" />
      {plan}
    </span>
  );
}
