// src/features/resumes/hooks/use-upload-resume.ts

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { uploadResume } from "../api/resume.api";
import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

export function useUploadResume() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      return uploadResume(request, file);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.all,
      });
    },
  });
}