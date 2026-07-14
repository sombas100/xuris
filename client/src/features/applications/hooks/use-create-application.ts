import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  createApplication,
} from "../api/application.api";
import type {
  CreateApplicationInput,
} from "../application.types";

export function useCreateApplication() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      createApplication(request, input),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.applications.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.dashboard.summary(),
        }),
      ]);
    },
  });
}