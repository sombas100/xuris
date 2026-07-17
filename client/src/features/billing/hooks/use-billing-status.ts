import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { getBillingStatus } from "../billing.api";

export function useBillingStatus() {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: queryKeys.billing.status(),
    queryFn: async () => {
      const response = await getBillingStatus(apiClient);
      return response.data;
    },
    staleTime: 30_000,
  });
}