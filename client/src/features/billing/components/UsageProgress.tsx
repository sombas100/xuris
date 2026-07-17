import { Infinity as InfinityIcon } from "lucide-react";

import type { UsageSummary } from "../billing.types";

type UsageProgressProps = {
  usage: UsageSummary;
};

export function UsageProgress({ usage }: UsageProgressProps) {
  if (usage.unlimited) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/6 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <InfinityIcon className="size-5" />
          </div>

          <div>
            <p className="font-medium text-white">Unlimited AI usage</p>

            <p className="mt-1 text-sm text-white/45">
              Your plan has no monthly generation limit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const limit = usage.usageLimit ?? 5;

  const percentage = Math.min((usage.usageCount / limit) * 100, 100);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">Monthly AI usage</p>

          <p className="mt-1 text-sm text-white/40">
            {usage.remaining ?? 0} generations remaining
          </p>
        </div>

        <p className="text-sm text-white/60">
          {usage.usageCount} / {limit}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary/70 to-primary transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
