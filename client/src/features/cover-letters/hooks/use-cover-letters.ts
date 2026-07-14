import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getCoverLetters } from "../api/cover-letter.api";

export function useCoverLetters(
  resumeId: string | null | undefined,
  jobPostId: string | null | undefined,
) {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.coverLetters.byResumeAndJob(
      resumeId ?? "",
      jobPostId ?? "",
    ),

    queryFn: ({ signal }) => {
      if (!resumeId || !jobPostId) {
        throw new Error(
          "Resume and job post IDs are required.",
        );
      }

      return getCoverLetters(
        request,
        resumeId,
        jobPostId,
        signal,
      );
    },

    select: (response) => response.data,

    enabled: Boolean(resumeId && jobPostId),
  });
}