export type CoverLetter = {
  id: string;
  userId: string;
  resumeId: string;
  jobPostId: string;

  title: string;
  content: string;
  tone: string | null;

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

export type CoverLetterResponse =
  ApiSuccessResponse<CoverLetter>;

export type CoverLetterListResponse =
  ApiSuccessResponse<CoverLetter[]>;

export type CreateCoverLetterInput = {
  resumeId: string;
  jobPostId: string;
};