export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "TECHNICAL_TEST"
  | "FINAL_INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export type ApplicationResume = {
  id: string;
  title: string;
  originalName: string;
  status: "UPLOADED" | "EXTRACTED" | "FAILED";
};

export type ApplicationJobPost = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  jobUrl: string | null;
};

export type ApplicationCoverLetter = {
  id: string;
  title: string;
  tone: string | null;
};

export type ApplicationStatusHistory = {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedAt: string;
};

export type JobApplication = {
  id: string;
  userId: string;

  resumeId: string | null;
  jobPostId: string | null;
  coverLetterId: string | null;

  company: string;
  role: string;
  jobUrl: string | null;
  location: string | null;
  salary: string | null;
  notes: string | null;

  status: ApplicationStatus;

  appliedAt: string | null;
  interviewAt: string | null;
  followUpDate: string | null;
  offerAt: string | null;
  closedAt: string | null;

  createdAt: string;
  updatedAt: string;

  resume: ApplicationResume | null;
  jobPost: ApplicationJobPost | null;
  coverLetter: ApplicationCoverLetter | null;

  statusHistory?: ApplicationStatusHistory[];
};

export type ApplicationPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApplicationListData = {
  applications: JobApplication[];
  pagination: ApplicationPagination;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type ApplicationResponse =
  ApiSuccessResponse<JobApplication>;

export type ApplicationListResponse =
  ApiSuccessResponse<ApplicationListData>;

export type CreateApplicationInput = {
  jobPostId?: string;
  resumeId?: string;
  coverLetterId?: string;

  company?: string;
  role?: string;
  jobUrl?: string | null;
  location?: string | null;
  salary?: string | null;
  notes?: string | null;

  status?: ApplicationStatus;

  appliedAt?: string | null;
  interviewAt?: string | null;
  followUpDate?: string | null;
};

export type UpdateApplicationInput = {
  resumeId?: string | null;
  jobPostId?: string | null;
  coverLetterId?: string | null;

  company?: string;
  role?: string;

  jobUrl?: string | null;
  location?: string | null;
  salary?: string | null;
  notes?: string | null;

  appliedAt?: string | null;
  interviewAt?: string | null;
  followUpDate?: string | null;
  offerAt?: string | null;
  closedAt?: string | null;
};

export type UpdateApplicationStatusInput = {
  status: ApplicationStatus;
  note?: string | null;
  interviewAt?: string | null;
  followUpDate?: string | null;
};

export type ApplicationListParams = {
  status?: ApplicationStatus;
  search?: string;
  sort?:
    | "createdAt"
    | "updatedAt"
    | "appliedAt"
    | "followUpDate"
    | "company"
    | "role";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
};