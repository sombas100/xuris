export type Plan = "FREE" | "PRO" | "TEAM";

export type SubscriptionStatus =
  | "INACTIVE"
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "UNPAID"
  | "PAUSED"
  | "CANCELLED";

export type BillingSubscription = {
  status: SubscriptionStatus;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export type BillingStatus = {
  plan: Plan;
  monthlyUsageLimit: number;
  monthlyUsageCount: number;
  usageResetDate: string | null;
  subscription: BillingSubscription | null;
};

export type UsageSummary = {
  plan: Plan;
  unlimited: boolean;
  usageCount: number;
  usageLimit: number | null;
  remaining: number | null;
  usageResetDate: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type BillingUrlResponse = {
  url: string;
};