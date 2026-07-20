import { AnalysisType } from "../../generated/prisma/enums.js";

import { dashboardRepository } from "./dashboard.repository.js";
import type {
  DashboardActivity,
  DashboardInsights,
} from "./dashboard.types.js";

const repository = dashboardRepository();

const RECENT_ACTIVITY_LIMIT = 6;

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
      recentInterviewPreps,
      recentCoverLetters,
      resumeScoreSummary,
      latestResumeAnalysis,
    ] = await Promise.all([
      repository.getSummaryCounts(userId),
      repository.getRecentAnalyses(userId),
      repository.getRecentInterviewPreps(userId),
      repository.getRecentCoverLetters(userId),
      repository.getResumeScoreSummary(userId),
      repository.getLatestResumeAnalysis(userId),
    ]);

    const analysisActivity: DashboardActivity[] = recentAnalyses.map(
      (analysis) => {
        if (analysis.type === AnalysisType.JOB_MATCH) {
          const jobName = analysis.jobPost
            ? `${analysis.jobPost.title}${
                analysis.jobPost.company
                  ? ` at ${analysis.jobPost.company}`
                  : ""
              }`
            : "a job advert";

          return {
            id: analysis.id,
            type: "JOB_COMPARISON",
            title: "Job comparison completed",
            description: analysis.resume
              ? `${analysis.resume.title} was compared with ${jobName}.`
              : `A resume was compared with ${jobName}.`,
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
      },
    );

    const interviewPrepActivity: DashboardActivity[] =
      recentInterviewPreps.map((session) => {
        const jobName = session.jobPost
          ? `${session.jobPost.title}${
              session.jobPost.company
                ? ` at ${session.jobPost.company}`
                : ""
            }`
          : "a selected role";

        return {
          id: session.id,
          type: "INTERVIEW_PREP",
          title: "Interview preparation generated",
          description: session.resume
            ? `Interview preparation was created for ${session.resume.title} and ${jobName}.`
            : `Interview preparation was created for ${jobName}.`,
          score: null,
          resumeId: session.resume?.id ?? null,
          jobPostId: session.jobPost?.id ?? null,
          createdAt: session.createdAt,
        };
      });

    const coverLetterActivity: DashboardActivity[] =
      recentCoverLetters.map((coverLetter) => {
        const jobName = coverLetter.jobPost
          ? `${coverLetter.jobPost.title}${
              coverLetter.jobPost.company
                ? ` at ${coverLetter.jobPost.company}`
                : ""
            }`
          : "a selected role";

        return {
          id: coverLetter.id,
          type: "COVER_LETTER",
          title: "Cover letter generated",
          description: coverLetter.resume
            ? `${coverLetter.title} was created using ${coverLetter.resume.title} for ${jobName}.`
            : `${coverLetter.title} was created for ${jobName}.`,
          score: null,
          resumeId: coverLetter.resume?.id ?? null,
          jobPostId: coverLetter.jobPost?.id ?? null,
          createdAt: coverLetter.createdAt,
        };
      });

    const recentActivity = [
      ...analysisActivity,
      ...interviewPrepActivity,
      ...coverLetterActivity,
    ]
      .sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime(),
      )
      .slice(0, RECENT_ACTIVITY_LIMIT);

    const scoreCategories: ScoreCategory[] = latestResumeAnalysis
      ? [
          {
            label: "ATS compatibility",
            score: latestResumeAnalysis.atsCompatibilityScore,
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
            score: latestResumeAnalysis.technicalSkillsScore,
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

    const scoreExtremes = getScoreExtremes(scoreCategories);

    const averageScore = resumeScoreSummary._avg.overallScore;

    const insights: DashboardInsights = {
      averageResumeScore:
        averageScore === null ? null : Math.round(averageScore),

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
