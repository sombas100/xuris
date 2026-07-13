import { History } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ResumeAnalysis } from "../resume-analysis.types";

type AnalysisHistoryProps = {
  analyses: ResumeAnalysis[];
  selectedAnalysisId: string | null;
  disabled?: boolean;
  onSelect: (analysisId: string) => void;
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function AnalysisHistory({
  analyses,
  selectedAnalysisId,
  disabled,
  onSelect,
}: AnalysisHistoryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <History className="size-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Analysis history</h2>

          <p className="mt-1 text-sm text-white/45">
            Review previous analyses for this resume.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {analyses.map((analysis, index) => {
          const isSelected = analysis.id === selectedAnalysisId;

          return (
            <button
              key={analysis.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(analysis.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isSelected
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">
                  {index === 0 ? "Latest analysis" : "Previous analysis"}
                </p>

                <span className="text-sm font-semibold text-primary">
                  {analysis.overallScore ?? "—"}/100
                </span>
              </div>

              <p className="mt-2 text-xs text-white/40">
                {formatDate(analysis.createdAt)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
