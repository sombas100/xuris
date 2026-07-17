import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";

import { createPortalSession } from "../billing.api";

export function useCreatePortal() {
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await createPortalSession(apiClient);

      return response.data;
    },

    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}