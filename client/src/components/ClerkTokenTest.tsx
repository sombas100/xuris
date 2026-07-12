import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export function ClerkTokenTest() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  async function handleGetToken() {
    const token = await getToken({
      skipCache: true,
    });

    if (!token) {
      console.error("No Clerk session token was returned.");
      return;
    }

    console.log("Clerk session token:", token);
  }

  if (!isLoaded) {
    return <p>Loading Clerk...</p>;
  }

  if (!isSignedIn) {
    return <p>You must sign in first.</p>;
  }

  return (
    <Button type="button" onClick={handleGetToken}>
      Generate temporary token
    </Button>
  );
}
