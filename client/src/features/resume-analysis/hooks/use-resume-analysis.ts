import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getResumeAnalyses } from "../api/resume-analysis.api";

export function useResumeAnalyses(
  resumeId: string | null | undefined,
) {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.resumeAnalysis.byResume(
      resumeId ?? "",
    ),

    queryFn: ({ signal }) => {
      if (!resumeId) {
        throw new Error("Resume ID is required.");
      }

      return getResumeAnalyses(
        request,
        resumeId,
        signal,
      );
    },

    select: (response) => response.data,

    enabled: Boolean(resumeId),
  });
}