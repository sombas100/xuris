import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { createCoverLetter } from "../api/cover-letter.api";
import type {
  CreateCoverLetterInput,
} from "../cover-letter.types";

export function useCreateCoverLetter() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateCoverLetterInput,
    ) => {
      return createCoverLetter(request, input);
    },

    onSuccess: async (response, input) => {
      queryClient.setQueryData(
        queryKeys.coverLetters.detail(
          response.data.id,
        ),
        response,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.coverLetters.byResumeAndJob(
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