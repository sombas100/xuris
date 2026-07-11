import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground lg:pl-24">
      <DashboardSidebar />

      <DashboardHeader />

      <main className="relative px-4 pb-6 pt-8 lg:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
