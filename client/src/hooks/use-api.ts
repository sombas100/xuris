import { useAuth } from "@clerk/clerk-react";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export function useApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  async function request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    if (!isLoaded) {
      throw new Error("Authentication is still loading");
    }

    if (!isSignedIn) {
      throw new Error("You must be signed in");
    }

    const token = await getToken();

    if (!token) {
      throw new Error("Unable to retrieve authentication token");
    }

    const headers = new Headers(options.headers);

    headers.set("Authorization", `Bearer ${token}`);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}${endpoint}`,
      {
        ...options,
        headers,
        body:
          options.body === undefined
            ? undefined
            : JSON.stringify(options.body),
      }
    );

    const responseBody = await readResponse(response);

    if (!response.ok) {
      throw new ApiError(
        responseBody?.error?.message ?? "Request failed",
        response.status,
        responseBody?.error?.code,
        responseBody?.error?.details
      );
    }

    return responseBody as T;
  }

  return {
    request,
    isAuthLoaded: isLoaded,
    isSignedIn,
  };
}

async function readResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}