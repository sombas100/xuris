import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api-error";
import { apiClient } from "@/lib/api-client";

describe("apiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the Clerk token and returns a successful JSON response", async () => {
    const getToken = vi.fn().mockResolvedValue("clerk-token");

    const responseBody = {
      id: "user-1",
      email: "corey@example.com",
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    const result = await apiClient<typeof responseBody>("/api/auth/v1/me", {
      method: "GET",
      getToken,
    });

    expect(getToken).toHaveBeenCalledOnce();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/v1/me",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer clerk-token",
        }),
      }),
    );

    expect(result).toEqual(responseBody);
  });

  it("serialises a JSON request body", async () => {
    const requestBody = {
      title: "Frontend Engineer",
      company: "Xuris",
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "application-1" }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await apiClient("/api/applications/v1", {
      method: "POST",
      body: requestBody,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/applications/v1",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(requestBody),
      }),
    );
  });

  it("returns null for a 204 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    );

    const result = await apiClient<null>("/api/resumes/v1/resume-1", {
      method: "DELETE",
    });

    expect(result).toBeNull();
  });

  it("throws an ApiError when the response is unsuccessful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            message: "Resume not found",
            code: "NOT_FOUND",
            details: {
              resumeId: "resume-1",
            },
          },
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    try {
      await apiClient("/api/resumes/v1/resume-1");

      throw new Error("Expected apiClient to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);

      expect(error).toMatchObject({
        message: "Resume not found",
        status: 404,
        code: "NOT_FOUND",
        details: {
          resumeId: "resume-1",
        },
      });
    }
  });
});