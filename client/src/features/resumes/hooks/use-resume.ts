import { useQuery } from "@tanstack/react-query";

import { getResumeById } from "../api/resume.api";
import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

export function useResume(resumeId: string | undefined) {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId ?? ""),

    queryFn: ({ signal }) => {
      if (!resumeId) {
        throw new Error("Resume ID is required.");
      }

      return getResumeById(request, resumeId, signal);
    },

    select: (response) => response.data,

    enabled: Boolean(resumeId),
  });
}