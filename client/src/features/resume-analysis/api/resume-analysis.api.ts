import type { ApiRequest } from "@/lib/api-client";

import type {
  ResumeAnalysisListResponse,
  ResumeAnalysisResponse,
} from "../resume-analysis.types";

const ANALYSIS_ENDPOINT = "/analysis/v1";

export function createResumeAnalysis(
  request: ApiRequest,
  resumeId: string,
) {
  return request<ResumeAnalysisResponse>(
    `${ANALYSIS_ENDPOINT}/resumes/${resumeId}/analyse`,
    {
      method: "POST",
    },
  );
}

export function getResumeAnalyses(
  request: ApiRequest,
  resumeId: string,
  signal?: AbortSignal,
) {
  return request<ResumeAnalysisListResponse>(
    `${ANALYSIS_ENDPOINT}/resumes/${resumeId}/analyses`,
    {
      signal,
    },
  );
}

export function getAnalysisById(
  request: ApiRequest,
  analysisId: string,
  signal?: AbortSignal,
) {
  return request<ResumeAnalysisResponse>(
    `${ANALYSIS_ENDPOINT}/${analysisId}`,
    {
      signal,
    },
  );
}