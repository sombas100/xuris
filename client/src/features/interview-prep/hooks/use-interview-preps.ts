import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getInterviewPreps } from "../api/interview-prep.api";

export function useInterviewPreps(
  resumeId: string | null | undefined,
  jobPostId: string | null | undefined,
) {
  const request = useApiClient();

  return useQuery({
    queryKey:
      queryKeys.interviewPrep.byResumeAndJob(
        resumeId ?? "",
        jobPostId ?? "",
      ),

    queryFn: ({ signal }) => {
      if (!resumeId || !jobPostId) {
        throw new Error(
          "Resume and job post IDs are required.",
        );
      }

      return getInterviewPreps(
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