import { ApiError, type ApiErrorResponse } from "@/lib/api-error";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL");
}

type GetToken = () => Promise<string | null>;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  getToken?: GetToken;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiClient<TResponse>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { getToken, headers, body, ...requestOptions } = options;

  const token = getToken ? await getToken() : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorBody =
      typeof responseBody === "object" && responseBody !== null
        ? (responseBody as ApiErrorResponse)
        : undefined;

    throw new ApiError(
      errorBody?.message ||
        (typeof responseBody === "string" && responseBody) ||
        "The request could not be completed.",
      response.status,
      errorBody?.code,
      errorBody?.errors,
    );
  }

  return responseBody as TResponse;
}