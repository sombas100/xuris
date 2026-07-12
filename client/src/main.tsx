import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider.tsx";
import App from "./App.tsx";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) throw new Error("Clerk publishable key missing");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <QueryProvider>
        <Router>
          <App />
        </Router>
      </QueryProvider>
    </ClerkProvider>
  </StrictMode>,
);
