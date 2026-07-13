import type { ApiRequest } from "@/lib/api-client";

import type {
  DashboardSummaryResponse,
} from "../dashboard.types";

const DASHBOARD_ENDPOINT = "/dashboard/v1";

export function getDashboardSummary(
  request: ApiRequest,
  signal?: AbortSignal,
) {
  return request<DashboardSummaryResponse>(
    `${DASHBOARD_ENDPOINT}/summary`,
    {
      signal,
    },
  );
}