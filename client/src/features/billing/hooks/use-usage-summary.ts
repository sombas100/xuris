import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getUsageSummary } from "../billing.api";

export function useUsageSummary() {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: queryKeys.usage.summary(),
    queryFn: async () => {
      const response = await getUsageSummary(apiClient);
      return response.data;
    },
    staleTime: 30_000,
  });
}