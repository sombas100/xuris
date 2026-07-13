export type JobComparisonResult = {
  matchScore: number;
  summary: string;
  matchingStrengths: string[];
  missingRequirements: string[];
  missingKeywords: string[];
  recommendedResumeChanges: string[];
  riskAreas: string[];
  interviewFocusAreas: string[];
};

export type JobComparison = {
  id: string;
  userId: string;
  resumeId: string;
  jobPostId: string;

  type: "JOB_MATCH";
  status:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";

  overallScore: number | null;
  summary: string | null;

  strengths: string[] | null;
  weaknesses: string[] | null;
  improvements: string[] | null;
  missingKeywords: string[] | null;

  result: JobComparisonResult | null;
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

export type JobComparisonResponse =
  ApiSuccessResponse<JobComparison>;

export type JobComparisonListResponse =
  ApiSuccessResponse<JobComparison[]>;

export type CreateJobComparisonInput = {
  resumeId: string;
  jobPostId: string;
};