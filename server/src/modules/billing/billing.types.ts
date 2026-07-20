import type Stripe from "stripe";

import {
  Plan,
  SubscriptionStatus,
} from "../../generated/prisma/enums.js";

export type SyncSubscriptionData = {
  userId: string;

  stripeSubscriptionId: string;
  stripePriceId: string | null;

  plan: Plan;
  status: SubscriptionStatus;

  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;

  cancelAtPeriodEnd: boolean;
};

export type BillingStatus = {
  plan: Plan;

  monthlyUsageLimit: number;
  monthlyUsageCount: number;
  usageResetDate: Date | null;

  subscription: {
    status: SubscriptionStatus;
    stripePriceId: string | null;

    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;

    cancelAtPeriodEnd: boolean;
  } | null;
};

export type StripeSubscriptionWithPeriod =
  Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
  };
