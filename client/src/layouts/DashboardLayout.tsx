import { Outlet } from "react-router-dom";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground lg:pl-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-105 w-200 rounded-full bg-primary/15 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-24 h-105 w-200 rounded-full bg-sky-500/10 blur-[140px]"
      />

      <div className="relative z-10 min-h-screen">
        <DashboardSidebar />

        <DashboardHeader />

        <main className="relative px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
