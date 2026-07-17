import { useEffect } from "react";
import { toast } from "sonner";

import type { BillingStatus } from "../billing.types";

type UsePendingCheckoutToastOptions = {
  billing: BillingStatus | undefined;
};

export function usePendingCheckoutToast({
  billing,
}: UsePendingCheckoutToastOptions) {
  useEffect(() => {
    const checkoutPending =
      sessionStorage.getItem(
        "xuris-checkout-pending",
      ) === "true";

    const proActive =
      billing?.plan === "PRO" ||
      billing?.plan === "TEAM";

    if (!checkoutPending || !proActive) {
      return;
    }

    sessionStorage.removeItem(
      "xuris-checkout-pending",
    );

    toast.success(
      "Welcome to Xuris Pro!",
      {
        id: "xuris-checkout-activation",
        description:
          "Your account now has unlimited AI generations.",
        duration: 6_000,
      },
    );
  }, [billing?.plan]);
}