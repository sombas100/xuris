import type { ApiRequest } from "@/lib/api-client";

import type {
  ApplicationListParams,
  ApplicationListResponse,
  ApplicationResponse,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationStatusInput,
} from "../application.types";

const APPLICATION_ENDPOINT = "/applications/v1";

function createQueryString(
  params: ApplicationListParams,
) {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.order) {
    searchParams.set("order", params.order);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export function getApplications(
  request: ApiRequest,
  params: ApplicationListParams,
  signal?: AbortSignal,
) {
  return request<ApplicationListResponse>(
    `${APPLICATION_ENDPOINT}${createQueryString(params)}`,
    {
      signal,
    },
  );
}

export function getApplicationById(
  request: ApiRequest,
  applicationId: string,
  signal?: AbortSignal,
) {
  return request<ApplicationResponse>(
    `${APPLICATION_ENDPOINT}/${applicationId}`,
    {
      signal,
    },
  );
}

export function createApplication(
  request: ApiRequest,
  input: CreateApplicationInput,
) {
  return request<ApplicationResponse>(
    APPLICATION_ENDPOINT,
    {
      method: "POST",
      body: input,
    },
  );
}

export function updateApplication(
  request: ApiRequest,
  applicationId: string,
  input: UpdateApplicationInput,
) {
  return request<ApplicationResponse>(
    `${APPLICATION_ENDPOINT}/${applicationId}`,
    {
      method: "PATCH",
      body: input,
    },
  );
}

export function updateApplicationStatus(
  request: ApiRequest,
  applicationId: string,
  input: UpdateApplicationStatusInput,
) {
  return request<ApplicationResponse>(
    `${APPLICATION_ENDPOINT}/${applicationId}/status`,
    {
      method: "PATCH",
      body: input,
    },
  );
}

export function deleteApplication(
  request: ApiRequest,
  applicationId: string,
) {
  return request<null>(
    `${APPLICATION_ENDPOINT}/${applicationId}`,
    {
      method: "DELETE",
    },
  );
}