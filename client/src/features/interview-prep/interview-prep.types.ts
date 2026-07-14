export type InterviewDifficulty =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED";

export type InterviewQuestion = {
  question: string;

  guidance?: string | null;
  suggestedAnswer?: string | null;
  exampleAnswer?: string | null;
  whyAsked?: string | null;
  keyPoints?: string[] | null;
};

export type InterviewPrep = {
  id: string;
  userId: string;
  resumeId: string;
  jobPostId: string;

  difficulty: InterviewDifficulty | null;
  summary: string | null;

  technicalQuestions: InterviewQuestion[] | null;
  behaviouralQuestions: InterviewQuestion[] | null;
  roleSpecificQuestions: InterviewQuestion[] | null;

  weaknessAreas: string[] | null;
  questionsToAsk: string[] | null;
  tips: string[] | null;

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

export type InterviewPrepResponse =
  ApiSuccessResponse<InterviewPrep>;

export type InterviewPrepListResponse =
  ApiSuccessResponse<InterviewPrep[]>;

export type CreateInterviewPrepInput = {
  resumeId: string;
  jobPostId: string;
};