import { Bot, CalendarDays } from "lucide-react";

import { AnalysisList } from "./AnalysisList";
import { AnalysisScoreCard } from "./AnalysisScoreCard";
import type { ResumeAnalysis } from "../resume-analysis.types";

type ResumeAnalysisResultsProps = {
  analysis: ResumeAnalysis;
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

export function ResumeAnalysisResults({
  analysis,
}: ResumeAnalysisResultsProps) {
  const scores = [
    {
      label: "ATS compatibility",
      value: analysis.atsCompatibilityScore,
    },
    {
      label: "Formatting",
      value: analysis.formattingScore,
    },
    {
      label: "Clarity",
      value: analysis.clarityScore,
    },
    {
      label: "Technical skills",
      value: analysis.technicalSkillsScore,
    },
    {
      label: "Experience",
      value: analysis.experienceScore,
    },
    {
      label: "Projects",
      value: analysis.projectsScore,
    },
    {
      label: "Education",
      value: analysis.educationScore,
    },
    {
      label: "Grammar",
      value: analysis.grammarScore,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Overall score</p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-5xl font-semibold text-white">
                {analysis.overallScore ?? "—"}
              </span>

              {analysis.overallScore !== null && (
                <span className="pb-1 text-white/40">/100</span>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(analysis.createdAt)}
            </div>

            {analysis.modelUsed && (
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                {analysis.modelUsed}
              </div>
            )}
          </div>
        </div>

        {analysis.summary && (
          <p className="mt-5 max-w-4xl leading-7 text-white/65">
            {analysis.summary}
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Score breakdown</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {scores.map((score) => (
            <AnalysisScoreCard
              key={score.label}
              label={score.label}
              score={score.value}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalysisList
          title="Strengths"
          tone="positive"
          items={analysis.strengths}
          emptyMessage="No strengths were returned."
        />

        <AnalysisList
          title="Weaknesses"
          tone="negative"
          items={analysis.weaknesses}
          emptyMessage="No weaknesses were returned."
        />

        <AnalysisList
          title="Recommended improvements"
          tone="improvement"
          items={analysis.improvements}
          emptyMessage="No improvements were returned."
        />

        <AnalysisList
          title="Missing keywords"
          tone="keyword"
          items={analysis.missingKeywords}
          emptyMessage="No missing keywords were identified."
        />
      </div>

      <AnalysisList
        title="Recommended job titles"
        tone="neutral"
        items={analysis.recommendedJobTitles}
        emptyMessage="No job titles were recommended."
      />
    </div>
  );
}
