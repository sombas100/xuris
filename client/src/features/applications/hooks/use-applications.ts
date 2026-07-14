import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getApplications } from "../api/application.api";
import type {
  ApplicationListParams,
} from "../application.types";

export function useApplications(
  params: ApplicationListParams,
) {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.applications.list(params),

    queryFn: ({ signal }) =>
      getApplications(request, params, signal),

    select: (response) => response.data,
  });
}