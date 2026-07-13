import type { ApiRequest } from "@/lib/api-client";

import type {
  CreateJobComparisonInput,
  JobComparisonListResponse,
  JobComparisonResponse,
} from "../job-comparison.types";

const ANALYSIS_ENDPOINT = "/analysis/v1";

export function createJobComparison(
  request: ApiRequest,
  input: CreateJobComparisonInput,
) {
  return request<JobComparisonResponse>(
    `${ANALYSIS_ENDPOINT}/job-match`,
    {
      method: "POST",
      body: input,
    },
  );
}

export function getJobComparisonsByResume(
  request: ApiRequest,
  resumeId: string,
  signal?: AbortSignal,
) {
  return request<JobComparisonListResponse>(
    `${ANALYSIS_ENDPOINT}/resumes/${resumeId}/job-matches`,
    {
      signal,
    },
  );
}