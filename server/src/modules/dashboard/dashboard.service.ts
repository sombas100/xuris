import { AnalysisType } from "../../../generated/prisma/enums";

import { dashboardRepository } from "./dashboard.repository";
import type {
  DashboardActivity,
  DashboardInsights,
} from "./dashboard.types";

const repository = dashboardRepository();

type ScoreCategory = {
  label: string;
  score: number | null;
};

function getScoreExtremes(
  categories: ScoreCategory[],
): Pick<
  DashboardInsights,
  | "strongestCategory"
  | "strongestCategoryScore"
  | "weakestCategory"
  | "weakestCategoryScore"
> {
  const availableScores = categories.filter(
    (
      category,
    ): category is {
      label: string;
      score: number;
    } => category.score !== null,
  );

  if (availableScores.length === 0) {
    return {
      strongestCategory: null,
      strongestCategoryScore: null,
      weakestCategory: null,
      weakestCategoryScore: null,
    };
  }

  const strongest = availableScores.reduce((current, category) =>
    category.score > current.score ? category : current,
  );

  const weakest = availableScores.reduce((current, category) =>
    category.score < current.score ? category : current,
  );

  return {
    strongestCategory: strongest.label,
    strongestCategoryScore: strongest.score,
    weakestCategory: weakest.label,
    weakestCategoryScore: weakest.score,
  };
}

export const dashboardService = () => {
  async function getDashboardSummary(userId: string) {
    const [
      counts,
      recentAnalyses,
      resumeScoreSummary,
      latestResumeAnalysis,
    ] = await Promise.all([
      repository.getSummaryCounts(userId),
      repository.getRecentAnalyses(userId),
      repository.getResumeScoreSummary(userId),
      repository.getLatestResumeAnalysis(userId),
    ]);

    const recentActivity: DashboardActivity[] =
      recentAnalyses.map((analysis) => {
        if (analysis.type === AnalysisType.JOB_MATCH) {
          const jobDescription = analysis.jobPost
            ? `${analysis.jobPost.title} at ${analysis.jobPost.company}`
            : "a job advert";

          return {
            id: analysis.id,
            type: "JOB_COMPARISON",
            title: "Job comparison completed",
            description: analysis.resume
              ? `${analysis.resume.title} was compared with ${jobDescription}.`
              : `A resume was compared with ${jobDescription}.`,
            score: analysis.overallScore,
            resumeId: analysis.resume?.id ?? null,
            jobPostId: analysis.jobPost?.id ?? null,
            createdAt: analysis.createdAt,
          };
        }

        return {
          id: analysis.id,
          type: "RESUME_ANALYSIS",
          title: "Resume analysis completed",
          description: analysis.resume
            ? `${analysis.resume.title} received a new analysis.`
            : "A resume received a new analysis.",
          score: analysis.overallScore,
          resumeId: analysis.resume?.id ?? null,
          jobPostId: null,
          createdAt: analysis.createdAt,
        };
      });

    const scoreCategories: ScoreCategory[] =
      latestResumeAnalysis
        ? [
            {
              label: "ATS compatibility",
              score:
                latestResumeAnalysis.atsCompatibilityScore,
            },
            {
              label: "Formatting",
              score: latestResumeAnalysis.formattingScore,
            },
            {
              label: "Clarity",
              score: latestResumeAnalysis.clarityScore,
            },
            {
              label: "Technical skills",
              score:
                latestResumeAnalysis.technicalSkillsScore,
            },
            {
              label: "Experience",
              score: latestResumeAnalysis.experienceScore,
            },
            {
              label: "Projects",
              score: latestResumeAnalysis.projectsScore,
            },
            {
              label: "Education",
              score: latestResumeAnalysis.educationScore,
            },
            {
              label: "Grammar",
              score: latestResumeAnalysis.grammarScore,
            },
          ]
        : [];

    const scoreExtremes =
      getScoreExtremes(scoreCategories);

    const averageScore =
      resumeScoreSummary._avg.overallScore;

    const insights: DashboardInsights = {
      averageResumeScore:
        averageScore === null
          ? null
          : Math.round(averageScore),

      latestResumeScore:
        latestResumeAnalysis?.overallScore ?? null,

      ...scoreExtremes,
    };

    return {
      counts,
      recentActivity,
      insights,
    };
  }

  return {
    getDashboardSummary,
  };
};