import { BriefcaseBusiness, History } from "lucide-react";

import { cn } from "@/lib/utils";
import type { JobPost } from "@/features/job-posts/job-post.types";

import type { JobComparison } from "../job-comparison.types";

type JobComparisonHistoryProps = {
  comparisons: JobComparison[];
  jobPosts: JobPost[];
  selectedComparisonId: string | null;
  disabled?: boolean;
  onSelect: (comparisonId: string) => void;
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

export function JobComparisonHistory({
  comparisons,
  jobPosts,
  selectedComparisonId,
  disabled,
  onSelect,
}: JobComparisonHistoryProps) {
  function getJobPost(jobPostId: string) {
    return jobPosts.find((jobPost) => jobPost.id === jobPostId);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <History className="size-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Comparison history
          </h2>

          <p className="mt-1 text-sm text-white/45">
            Review previous job matches for this resume.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {comparisons.map((comparison, index) => {
          const selected = comparison.id === selectedComparisonId;

          const jobPost = getJobPost(comparison.jobPostId);

          return (
            <button
              key={comparison.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(comparison.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="size-4 shrink-0 text-primary" />

                    <p className="truncate text-sm font-medium text-white">
                      {jobPost?.title ?? "Job comparison"}
                    </p>
                  </div>

                  {jobPost?.company && (
                    <p className="mt-1 truncate text-xs text-white/45">
                      {jobPost.company}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-sm font-semibold text-primary">
                  {comparison.overallScore ?? "—"}/100
                </span>
              </div>

              <p className="mt-3 text-xs text-white/35">
                {index === 0 ? "Latest · " : ""}
                {formatDate(comparison.createdAt)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
