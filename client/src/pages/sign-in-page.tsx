import { useDocumentTitle } from "@/hooks/use-document-title";
import { SignIn } from "@clerk/clerk-react";

export function SignInPage() {
  useDocumentTitle("Sign-in");
  return (
    <main className="min-h-screen p-6 bg-background">
      <div className="flex items-center justify-center h-screen max-w-xl mx-auto">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
