export type DashboardCounts = {
  resumeAnalyses: number;
  jobComparisons: number;
  interviewSessions: number;
  applications: number;
};

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
  createdAt: string;
};

export type DashboardInsights = {
  averageResumeScore: number | null;
  latestResumeScore: number | null;
  strongestCategory: string | null;
  strongestCategoryScore: number | null;
  weakestCategory: string | null;
  weakestCategoryScore: number | null;
};

export type DashboardSummary = {
  counts: DashboardCounts;
  recentActivity: DashboardActivity[];
  insights: DashboardInsights;
};

export type DashboardSummaryResponse = {
  success: true;
  data: DashboardSummary;
};