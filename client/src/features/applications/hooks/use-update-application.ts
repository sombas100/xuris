import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";
import { queryKeys } from "@/lib/query-keys";

import { updateApplication } from "../api/application.api";
import type {
  UpdateApplicationInput,
} from "../application.types";

type UpdateApplicationVariables = {
  applicationId: string;
  input: UpdateApplicationInput;
};

export function useUpdateApplication() {
  const request = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: UpdateApplicationVariables) => {
      return updateApplication(
        request,
        applicationId,
        input,
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