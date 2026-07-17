import { useMutation } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";

import { createCheckoutSession } from "../billing.api";

export function useCreateCheckout() {
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: async () => {
      const response =
        await createCheckoutSession(apiClient);

      return response.data;
    },

    onSuccess: ({ url }) => {
      window.location.assign(url);
    },
  });
}