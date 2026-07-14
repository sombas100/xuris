import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  getApplicationById,
} from "../api/application.api";

export function useApplication(
  applicationId: string | undefined,
) {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.applications.detail(
      applicationId ?? "",
    ),

    queryFn: ({ signal }) => {
      if (!applicationId) {
        throw new Error(
          "Application ID is required.",
        );
      }

      return getApplicationById(
        request,
        applicationId,
        signal,
      );
    },

    select: (response) => response.data,

    enabled: Boolean(applicationId),
  });
}