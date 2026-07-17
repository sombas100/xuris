import type {
  ApiResponse,
  BillingStatus,
  BillingUrlResponse,
  UsageSummary,
} from "./billing.types";

type ApiClient = <T>(
  path: string,
  options?: RequestInit,
) => Promise<T>;

export function getBillingStatus(
  apiClient: ApiClient,
) {
  return apiClient<ApiResponse<BillingStatus>>(
    "/billing/v1/status",
  );
}

export function getUsageSummary(
  apiClient: ApiClient,
) {
  return apiClient<ApiResponse<UsageSummary>>(
    "/usage/v1/summary",
  );
}

export function createCheckoutSession(
  apiClient: ApiClient,
) {
  return apiClient<ApiResponse<BillingUrlResponse>>(
    "/billing/v1/checkout",
    {
      method: "POST",
    },
  );
}

export function createPortalSession(
  apiClient: ApiClient,
) {
  return apiClient<ApiResponse<BillingUrlResponse>>(
    "/billing/v1/portal",
    {
      method: "POST",
    },
  );
}