export type DashboardActivityType =
  | "RESUME_ANALYSIS"
  | "JOB_COMPARISON";

export type DashboardActivity = {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  score: number | null;
  resumeId: string | null;
  jobPostId: string | null;
  createdAt: Date;
};

export type DashboardInsights = {
  averageResumeScore: number | null;
  latestResumeScore: number | null;
  strongestCategory: string | null;
  strongestCategoryScore: number | null;
  weakestCategory: string | null;
  weakestCategoryScore: number | null;
};