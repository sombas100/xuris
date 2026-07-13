import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getJobPosts } from "../api/job-post.api";

export function useJobPosts() {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.jobPosts.list(),

    queryFn: ({ signal }) => {
      return getJobPosts(request, signal);
    },

    select: (response) => response.data,
  });
}