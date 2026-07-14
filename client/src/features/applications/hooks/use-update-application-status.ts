import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  updateApplicationStatus,
} from "../api/application.api";
import type {
  UpdateApplicationStatusInput,
} from "../application.types";

export function useUpdateApplicationStatus(
  applicationId: string,
) {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: UpdateApplicationStatusInput,
    ) =>
      updateApplicationStatus(
        request,
        applicationId,
        input,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.applications.detail(
              applicationId,
            ),
        }),

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