import { UserButton, useUser } from "@clerk/clerk-react";

export function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <main>
      <header>
        <h1>
          Welcome
          {user?.firstName ? `, ${user.firstName}` : ""}
        </h1>

        <UserButton />
      </header>

      <p>Your Xuris dashboard is ready.</p>
    </main>
  );
}
