import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { createInterviewPrep } from "../api/interview-prep.api";
import type {
  CreateInterviewPrepInput,
} from "../interview-prep.types";

export function useCreateInterviewPrep() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateInterviewPrepInput,
    ) => {
      return createInterviewPrep(
        request,
        input,
      );
    },

    onSuccess: async (response, input) => {
      queryClient.setQueryData(
        queryKeys.interviewPrep.detail(
          response.data.id,
        ),
        response,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.interviewPrep.byResumeAndJob(
              input.resumeId,
              input.jobPostId,
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