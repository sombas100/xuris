// src/features/resumes/hooks/use-resumes.ts

import { useQuery } from "@tanstack/react-query";

import { getResumes } from "../api/resume.api";
import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

export function useResumes() {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.resumes.list(),

    queryFn: ({ signal }) => {
      return getResumes(request, signal);
    },

    select: (response) => response.data,
  });
}