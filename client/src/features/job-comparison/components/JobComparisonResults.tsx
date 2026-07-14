import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  MessagesSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import type { JobPost } from "@/features/job-posts/job-post.types";
import { cn } from "@/lib/utils";

import { JobComparisonList } from "./JobComparisonList";
import type {
  JobComparison,
  JobComparisonResult,
} from "../job-comparison.types";

type JobComparisonResultsProps = {
  comparison: JobComparison;
  jobPost?: JobPost;
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

function getComparisonResult(comparison: JobComparison): JobComparisonResult {
  if (comparison.result) {
    return comparison.result;
  }

  return {
    matchScore: comparison.overallScore ?? 0,
    summary: comparison.summary ?? "",
    matchingStrengths: comparison.strengths ?? [],
    missingRequirements: [],
    missingKeywords: comparison.missingKeywords ?? [],
    recommendedResumeChanges: comparison.improvements ?? [],
    riskAreas: comparison.weaknesses ?? [],
    interviewFocusAreas: [],
  };
}

function getScoreClasses(score: number) {
  if (score >= 80) {
    return {
      border: "border-green-500/25",
      background: "bg-green-500/[0.06]",
      text: "text-green-300",
    };
  }

  if (score >= 60) {
    return {
      border: "border-amber-500/25",
      background: "bg-amber-500/[0.06]",
      text: "text-amber-300",
    };
  }

  return {
    border: "border-red-500/25",
    background: "bg-red-500/[0.06]",
    text: "text-red-300",
  };
}

export function JobComparisonResults({
  comparison,
  jobPost,
}: JobComparisonResultsProps) {
  const result = getComparisonResult(comparison);
  const scoreClasses = getScoreClasses(result.matchScore);

  return (
    <div className="space-y-6">
      <section
        className={[
          "rounded-3xl border p-6",
          scoreClasses.border,
          scoreClasses.background,
        ].join(" ")}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-sm font-medium ${scoreClasses.text}`}>
              Job match score
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-semibold text-white">
                {result.matchScore}
              </span>

              <span className="pb-1 text-white/40">/100</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(comparison.createdAt)}
            </div>

            {comparison.modelUsed && (
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                {comparison.modelUsed}
              </div>
            )}
          </div>
        </div>

        {jobPost && (
          <div className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <BriefcaseBusiness className="size-4 text-primary" />
              {jobPost.title}
              {jobPost.company ? ` at ${jobPost.company}` : ""}
            </div>

            {jobPost.location && (
              <div className="flex items-center gap-2 text-white/50">
                <MapPin className="size-4" />
                {jobPost.location}
              </div>
            )}
          </div>
        )}

        {result.summary && (
          <p className="mt-6 max-w-4xl leading-7 text-white/65">
            {result.summary}
          </p>
        )}

        <div className="mt-6">
          <Link
            to={`/dashboard/interview-prep?resumeId=${encodeURIComponent(
              comparison.resumeId,
            )}&jobPostId=${encodeURIComponent(comparison.jobPostId)}`}
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
          >
            <MessagesSquare className="size-4" />
            Prepare for this interview
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <JobComparisonList
          title="Matching strengths"
          tone="positive"
          items={result.matchingStrengths}
          emptyMessage="No matching strengths were returned."
        />

        <JobComparisonList
          title="Missing requirements"
          tone="warning"
          items={result.missingRequirements}
          emptyMessage="No missing requirements were identified."
        />

        <JobComparisonList
          title="Risk areas"
          tone="negative"
          items={result.riskAreas}
          emptyMessage="No significant risk areas were identified."
        />

        <JobComparisonList
          title="Recommended resume changes"
          tone="improvement"
          items={result.recommendedResumeChanges}
          emptyMessage="No resume changes were recommended."
        />

        <JobComparisonList
          title="Missing keywords"
          tone="keyword"
          items={result.missingKeywords}
          emptyMessage="No missing keywords were identified."
        />

        <JobComparisonList
          title="Interview focus areas"
          tone="interview"
          items={result.interviewFocusAreas}
          emptyMessage="No interview focus areas were returned."
        />
      </div>
    </div>
  );
}
