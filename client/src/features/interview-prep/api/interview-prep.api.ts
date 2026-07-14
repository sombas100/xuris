import type { ApiRequest } from "@/lib/api-client";

import type {
  CreateInterviewPrepInput,
  InterviewPrepListResponse,
  InterviewPrepResponse,
} from "../interview-prep.types";

const INTERVIEW_PREP_ENDPOINT = "/interview-prep/v1";

export function createInterviewPrep(
  request: ApiRequest,
  input: CreateInterviewPrepInput,
) {
  return request<InterviewPrepResponse>(
    INTERVIEW_PREP_ENDPOINT,
    {
      method: "POST",
      body: input,
    },
  );
}

export function getInterviewPreps(
  request: ApiRequest,
  resumeId: string,
  jobPostId: string,
  signal?: AbortSignal,
) {
  return request<InterviewPrepListResponse>(
    `${INTERVIEW_PREP_ENDPOINT}/resumes/${resumeId}/jobs/${jobPostId}`,
    {
      signal,
    },
  );
}

export function getInterviewPrepById(
  request: ApiRequest,
  interviewPrepId: string,
  signal?: AbortSignal,
) {
  return request<InterviewPrepResponse>(
    `${INTERVIEW_PREP_ENDPOINT}/${interviewPrepId}`,
    {
      signal,
    },
  );
}