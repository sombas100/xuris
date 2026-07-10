import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
  return (
    <main className="min-h-screen p-6 bg-background">
      <div className="flex items-center justify-center h-screen max-w-xl mx-auto">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
