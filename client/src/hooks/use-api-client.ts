import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

import {
  apiClient,
  type ApiRequest,
} from "@/lib/api-client";

export function useApiClient(): ApiRequest {
  const { getToken } = useAuth();

  return useCallback(
    (endpoint, options = {}) => {
      return apiClient(endpoint, {
        ...options,
        getToken,
      });
    },
    [getToken],
  );
}