import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main>
      <nav>
        <Link to="/">Xuris</Link>

        <SignedOut>
          <SignInButton mode="redirect">
            <button type="button">Sign in</button>
          </SignInButton>

          <SignUpButton mode="redirect">
            <button type="button">Get started</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link to="/dashboard">Dashboard</Link>
          <UserButton />
        </SignedIn>
      </nav>

      <section>
        <h1>Build stronger applications with Xuris</h1>
        <p>
          Analyse resumes, compare them with job adverts, generate tailored
          cover letters, and prepare for interviews.
        </p>
      </section>
    </main>
  );
}
