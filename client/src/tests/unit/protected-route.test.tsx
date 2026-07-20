import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const clerkMocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

vi.mock("@clerk/clerk-react", () => ({
  useAuth: clerkMocks.useAuth,
  RedirectToSignIn: () => <div>Redirecting to sign in...</div>,
}));

vi.mock("@/components/loading/ProtectedRouteLoading", () => ({
  ProtectedRouteLoading: () => <div>Loading protected route...</div>,
}));

import { ProtectedRoute } from "../../routes/Protected-route";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading component while Clerk is loading", () => {
    clerkMocks.useAuth.mockReturnValue({
      isLoaded: false,
      isSignedIn: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Loading protected route...")).toBeInTheDocument();

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to sign in", () => {
    clerkMocks.useAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Redirecting to sign in...")).toBeInTheDocument();

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders protected content for authenticated users", () => {
    clerkMocks.useAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();

    expect(
      screen.queryByText("Loading protected route..."),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Redirecting to sign in..."),
    ).not.toBeInTheDocument();
  });
});
