// src/features/resumes/resume.types.ts

export type ResumeStatus =
  | "UPLOADED"
  | "EXTRACTED"
  | "FAILED"
  | 'PROCESSING'
  | 'READY'

export type Resume = {
  id: string;
  userId: string;
  title: string;
  originalName: string;
  fileUrl: string | null;
  fileKey: string | null;
  mimeType: string | null;
  fileSize: number | null;
  extractedText: string | null;
  status: ResumeStatus;
  createdAt: string;
  updatedAt: string;
};

export type ResumeDetails = Resume & {
  downloadUrl: string;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ResumeListResponse = ApiSuccessResponse<Resume[]>;
export type ResumeResponse = ApiSuccessResponse<Resume>;
export type ResumeDetailsResponse = ApiSuccessResponse<ResumeDetails>;