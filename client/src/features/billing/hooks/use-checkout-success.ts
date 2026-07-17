import { useEffect, useRef } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";

import type { BillingStatus } from "../billing.types";

type UseCheckoutSuccessOptions = {
  billing: BillingStatus | undefined;
  refetchBilling: () => Promise<unknown>;
  refetchUsage: () => Promise<unknown>;
};

const CHECKOUT_TOAST_ID =
  "xuris-checkout-activation";

export function useCheckoutSuccess({
  billing,
  refetchBilling,
  refetchUsage,
}: UseCheckoutSuccessOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const processingRef = useRef(false);

  const checkoutSucceeded =
    searchParams.get("checkout") === "success";

  const proActive =
    billing?.plan === "PRO" ||
    billing?.plan === "TEAM";

  useEffect(() => {
    if (!checkoutSucceeded) {
      return;
    }

    /*
     * Store this before polling so the success message
     * survives navigation and component remounts.
     */
    sessionStorage.setItem(
      "xuris-checkout-pending",
      "true",
    );

    if (proActive) {
      sessionStorage.removeItem(
        "xuris-checkout-pending",
      );

      toast.success(
        "Welcome to Xuris Pro!",
        {
          id: CHECKOUT_TOAST_ID,
          description:
            "Your account now has unlimited AI generations.",
          duration: 6_000,
        },
      );

      navigate("/dashboard/billing", {
        replace: true,
      });

      return;
    }

    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    toast.loading(
      "Payment successful. Activating Xuris Pro...",
      {
        id: CHECKOUT_TOAST_ID,
        description:
          "We are confirming your subscription.",
      },
    );

    let cancelled = false;
    let attempts = 0;

    const maximumAttempts = 12;

    async function refreshBillingState() {
      attempts += 1;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.billing.status(),
        }),

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.usage.summary(),
        }),

        refetchBilling(),
        refetchUsage(),
      ]);

      if (
        attempts >= maximumAttempts &&
        !cancelled
      ) {
        sessionStorage.removeItem(
          "xuris-checkout-pending",
        );

        toast.info(
          "Your payment was successful",
          {
            id: CHECKOUT_TOAST_ID,
            description:
              "Your Pro access may take a moment to appear. Refresh the page shortly.",
            duration: 6_000,
          },
        );

        navigate("/dashboard/billing", {
          replace: true,
        });
      }
    }

    void refreshBillingState();

    const intervalId = window.setInterval(() => {
      void refreshBillingState();
    }, 1_500);

    return () => {
      cancelled = true;

      window.clearInterval(intervalId);
    };
  }, [
    checkoutSucceeded,
    navigate,
    proActive,
    queryClient,
    refetchBilling,
    refetchUsage,
  ]);
}