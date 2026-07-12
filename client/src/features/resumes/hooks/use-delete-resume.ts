// src/features/resumes/hooks/use-delete-resume.ts

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteResume } from "../api/resume.api";
import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteResume() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => {
      return deleteResume(request, resumeId);
    },

    onSuccess: async (_, resumeId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.resumes.detail(resumeId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.list(),
      });
    },
  });
}