import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { updateApplicationStatus } from "../api/application.api";
import type {
  ApplicationStatus,
} from "../application.types";

type MoveApplicationStatusInput = {
  applicationId: string;
  status: ApplicationStatus;
};

export function useMoveApplicationStatus() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: MoveApplicationStatusInput) => {
      return updateApplicationStatus(
        request,
        applicationId,
        {
          status,
          note: `Application moved to ${status
            .toLowerCase()
            .replaceAll("_", " ")} from the Kanban board.`,
        },
      );
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.applications.detail(
              variables.applicationId,
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