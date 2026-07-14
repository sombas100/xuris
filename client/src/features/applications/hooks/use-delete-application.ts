import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import {
  deleteApplication,
} from "../api/application.api";

export function useDeleteApplication() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      deleteApplication(request, applicationId),

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