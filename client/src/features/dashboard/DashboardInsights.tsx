import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react";

import type { DashboardInsights as DashboardInsightsData } from "@/features/dashboard/dashboard.types";

type DashboardInsightsProps = {
  insights: DashboardInsightsData;
};

export default function DashboardInsights({
  insights,
}: DashboardInsightsProps) {
  if (insights.latestResumeScore === null) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-primary/20">
        <p className="max-w-xs text-center text-white/40">
          Analyse a resume to unlock personalised insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-5 text-primary" />

          <p className="text-sm text-white/50">Latest resume score</p>
        </div>

        <p className="mt-3 text-3xl font-semibold text-white">
          {insights.latestResumeScore}
          <span className="text-sm text-white/35">/100</span>
        </p>

        {insights.averageResumeScore !== null && (
          <p className="mt-2 text-xs text-white/40">
            Average score: {insights.averageResumeScore}/100
          </p>
        )}
      </div>

      {insights.strongestCategory && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/4 p-4">
          <div className="flex items-center gap-2 text-green-300">
            <ArrowUp className="size-4" />
            <p className="text-sm font-medium">Strongest area</p>
          </div>

          <p className="mt-2 text-white">{insights.strongestCategory}</p>

          <p className="mt-1 text-sm text-green-300">
            {insights.strongestCategoryScore}/100
          </p>
        </div>
      )}

      {insights.weakestCategory && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/4 p-4">
          <div className="flex items-center gap-2 text-amber-300">
            <ArrowDown className="size-4" />
            <p className="text-sm font-medium">Focus area</p>
          </div>

          <p className="mt-2 text-white">{insights.weakestCategory}</p>

          <p className="mt-1 text-sm text-amber-300">
            {insights.weakestCategoryScore}/100
          </p>
        </div>
      )}
    </div>
  );
}
