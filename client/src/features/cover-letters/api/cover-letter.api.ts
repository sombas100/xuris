import type { ApiRequest } from "@/lib/api-client";

import type {
  CoverLetterListResponse,
  CoverLetterResponse,
  CreateCoverLetterInput,
} from "../cover-letter.types";

const COVER_LETTER_ENDPOINT = "/cover-letters/v1";

export function createCoverLetter(
  request: ApiRequest,
  input: CreateCoverLetterInput,
) {
  return request<CoverLetterResponse>(
    COVER_LETTER_ENDPOINT,
    {
      method: "POST",
      body: input,
    },
  );
}

export function getCoverLetters(
  request: ApiRequest,
  resumeId: string,
  jobPostId: string,
  signal?: AbortSignal,
) {
  return request<CoverLetterListResponse>(
    `${COVER_LETTER_ENDPOINT}/resumes/${resumeId}/jobs/${jobPostId}`,
    {
      signal,
    },
  );
}

export function getCoverLetterById(
  request: ApiRequest,
  coverLetterId: string,
  signal?: AbortSignal,
) {
  return request<CoverLetterResponse>(
    `${COVER_LETTER_ENDPOINT}/${coverLetterId}`,
    {
      signal,
    },
  );
}