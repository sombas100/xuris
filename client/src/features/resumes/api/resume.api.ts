// src/features/resumes/api/resume.api.ts

import type { ApiRequest } from "@/lib/api-client";

import type {
  ResumeDetailsResponse,
  ResumeListResponse,
  ResumeResponse,
} from "../resume.types";

const RESUME_ENDPOINT = "/resumes/v1";

export function getResumes(
  request: ApiRequest,
  signal?: AbortSignal,
) {
  return request<ResumeListResponse>(RESUME_ENDPOINT, {
    signal,
  });
}

export function getResumeById(
  request: ApiRequest,
  resumeId: string,
  signal?: AbortSignal,
) {
  return request<ResumeDetailsResponse>(
    `${RESUME_ENDPOINT}/${resumeId}`,
    { signal },
  );
}

export function uploadResume(
  request: ApiRequest,
  file: File,
) {
  const formData = new FormData();

  formData.append("resume", file);

  return request<ResumeResponse>(
    `${RESUME_ENDPOINT}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export function deleteResume(
  request: ApiRequest,
  resumeId: string,
) {
  return request<null>(
    `${RESUME_ENDPOINT}/${resumeId}`,
    {
      method: "DELETE",
    },
  );
}