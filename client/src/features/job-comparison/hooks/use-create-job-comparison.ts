import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  createJobComparison,
} from "../api/job-comparison.api";
import type {
  CreateJobComparisonInput,
} from "../job-comparison.types";

export function useCreateJobComparison() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateJobComparisonInput,
    ) => {
      return createJobComparison(
        request,
        input,
      );
    },

    onSuccess: async (_, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.jobComparison.byResume(
              input.resumeId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.dashboard.summary(),
            
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.usage.summary(),
    }),
      ]);
    },
  });
}