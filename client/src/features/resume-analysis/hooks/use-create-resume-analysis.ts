import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { createResumeAnalysis } from "../api/resume-analysis.api";

export function useCreateResumeAnalysis() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => {
      return createResumeAnalysis(request, resumeId);
    },

    onSuccess: async (response, resumeId) => {
      queryClient.setQueryData(
        queryKeys.resumeAnalysis.detail(
          response.data.id,
        ),
        response,
      );

      await Promise.all([
        queryClient.invalidateQueries({
        queryKey:
            queryKeys.resumeAnalysis.byResume(resumeId),
        }),

        queryClient.invalidateQueries({
            queryKey: queryKeys.dashboard.summary(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.usage.summary(),
    }),
    ]);
        },
  });
}