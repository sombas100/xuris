import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

import { apiClient } from "@/lib/api-client";

type ApiRequestOptions = Parameters<typeof apiClient>[1];

export function useApiClient() {
  const { getToken } = useAuth();

  return useCallback(
    <TResponse>(
      endpoint: string,
      options: ApiRequestOptions = {},
    ): Promise<TResponse> => {
      return apiClient<TResponse>(endpoint, {
        ...options,
        getToken,
      });
    },
    [getToken],
  );
}