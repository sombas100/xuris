export type JobPost = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  description: string;
  jobUrl: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type JobPostResponse =
  ApiSuccessResponse<JobPost>;

export type JobPostListResponse =
  ApiSuccessResponse<JobPost[]>;

export type CreateJobPostFromTextInput = {
  rawText: string;
};