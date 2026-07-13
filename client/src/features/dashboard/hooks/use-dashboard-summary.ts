import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getDashboardSummary } from "../api/dashboard.api";

export function useDashboardSummary() {
  const request = useApiClient();

  return useQuery({
    queryKey: queryKeys.dashboard.summary(),

    queryFn: ({ signal }) => {
      return getDashboardSummary(request, signal);
    },

    select: (response) => response.data,
  });
}