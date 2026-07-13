export type AnalysisType =
  | "RESUME_REVIEW"
  | "JOB_MATCH";

export type AnalysisStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type ResumeAnalysis = {
  id: string;
  userId: string;
  resumeId: string;
  jobPostId: null;

  type: "RESUME_REVIEW";
  status: AnalysisStatus;

  overallScore: number | null;

  atsCompatibilityScore: number | null;
  formattingScore: number | null;
  clarityScore: number | null;
  technicalSkillsScore: number | null;
  experienceScore: number | null;
  projectsScore: number | null;
  educationScore: number | null;
  grammarScore: number | null;

  summary: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  improvements: string[] | null;
  missingKeywords: string[] | null;
  recommendedJobTitles: string[] | null;

  result: unknown;
  errorReason: string | null;

  modelUsed: string | null;
  promptTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;

  createdAt: string;
  updatedAt: string;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type ResumeAnalysisResponse =
  ApiSuccessResponse<ResumeAnalysis>;

export type ResumeAnalysisListResponse =
  ApiSuccessResponse<ResumeAnalysis[]>;