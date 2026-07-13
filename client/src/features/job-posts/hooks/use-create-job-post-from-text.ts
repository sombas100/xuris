import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { createJobPostFromText } from "../api/job-post.api";

export function useCreateJobPostFromText() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rawText: string) => {
      return createJobPostFromText(request, {
        rawText,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.jobPosts.all,
      });
    },
  });
}