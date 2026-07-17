import { ProtectedRouteLoading } from "@/components/loading/ProtectedRouteLoading";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <ProtectedRouteLoading />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
}
