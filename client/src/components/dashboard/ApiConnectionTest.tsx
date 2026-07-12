import { useQuery } from "@tanstack/react-query";

import { useApiClient } from "@/hooks/use-api-client";

type CurrentUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  plan: "FREE" | "PRO";
  monthlyUsageLimit: number;
  monthlyUsageCount: number;
  usageResetDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type TestResponse = {
  success: boolean;
  data: CurrentUser;
};

export function ApiConnectionTest() {
  const request = useApiClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["api-connection-test"],
    queryFn: () => request<TestResponse>("/auth/v1/me"),
  });

  if (isPending) {
    return <p>Checking API connection...</p>;
  }

  if (isError) {
    return <p className="text-destructive">API error: {error.message}</p>;
  }

  return (
    <div className="rounded-xl border border-white/10 p-6 space-y-2">
      <h3 className="font-semibold text-lg">API Connected ✅</h3>

      <p>
        <strong>Name:</strong> {data.data.firstName} {data.data.lastName}
      </p>

      <p>
        <strong>Email:</strong> {data.data.email}
      </p>

      <p>
        <strong>Plan:</strong> {data.data.plan}
      </p>

      <p>
        <strong>Usage:</strong> {data.data.monthlyUsageCount} /{" "}
        {data.data.monthlyUsageLimit}
      </p>
    </div>
  );
}
