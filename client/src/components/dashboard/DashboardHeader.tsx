import { UserButton, useUser } from "@clerk/clerk-react";

const DashboardHeader = () => {
  const { user, isLoaded } = useUser();
  return (
    <header className="sticky top-4 z-30 px-4 lg:px-6">
      <div className="flex h-16 items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-5 shadow-xl backdrop-blur-xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            Dashboard
          </p>

          <h1 className="mt-0.5 text-base font-semibold text-white">
            Welcome back {user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            className="
            cursor-pointer
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            text-sm
            font-medium
            text-white/70
            transition-all
            duration-200
            hover:border-primary/40
            hover:bg-primary/10
            hover:text-white
            hover:shadow-[0_0_20px_rgba(204,93,232,0.2)]
          "
          >
            Account
          </button>
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
