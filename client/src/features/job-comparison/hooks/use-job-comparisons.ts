import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  getJobComparisonsByResume,
} from "../api/job-comparison.api";

export function useJobComparisons(
  resumeId: string | null | undefined,
) {
  const request = useApiClient();

  return useQuery({
    queryKey:
      queryKeys.jobComparison.byResume(
        resumeId ?? "",
      ),

    queryFn: ({ signal }) => {
      if (!resumeId) {
        throw new Error("Resume ID is required.");
      }

      return getJobComparisonsByResume(
        request,
        resumeId,
        signal,
      );
    },

    select: (response) => response.data,

    enabled: Boolean(resumeId),
  });
}