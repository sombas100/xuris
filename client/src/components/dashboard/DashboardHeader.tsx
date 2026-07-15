import { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  FilePenLine,
  FileSearch,
  Files,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Scale,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const dashboardLinks = [
  {
    name: "Dashboard",
    description: "Overview and recent activity",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resumes",
    description: "Upload and manage resumes",
    href: "/dashboard/resumes",
    icon: Files,
  },
  {
    name: "Resume analysis",
    description: "ATS scoring and improvements",
    href: "/dashboard/resume-analysis",
    icon: FileSearch,
  },
  {
    name: "Job comparison",
    description: "Compare a resume with a role",
    href: "/dashboard/job-comparison",
    icon: Scale,
  },
  {
    name: "Interview prep",
    description: "Generate interview guidance",
    href: "/dashboard/interview-prep",
    icon: MessagesSquare,
  },
  {
    name: "Cover letters",
    description: "Create tailored cover letters",
    href: "/dashboard/cover-letters",
    icon: FilePenLine,
  },
  {
    name: "Applications",
    description: "Track your job applications",
    href: "/dashboard/applications",
    icon: BriefcaseBusiness,
  },
];

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useUser();
  const location = useLocation();

  function isActiveRoute(href: string) {
    if (href === "/dashboard") {
      return location.pathname === href;
    }

    return location.pathname.startsWith(href);
  }

  return (
    <header className="sticky top-4 z-10 px-4 lg:px-6">
      <div className="relative mx-auto">
        <div className="flex h-16 items-center justify-between rounded-3xl border border-white/10 bg-black/40 px-4 shadow-xl backdrop-blur-xl sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              Dashboard
            </p>

            <h1 className="mt-0.5 truncate text-sm font-semibold text-white sm:text-base">
              Welcome back
              {user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
          </div>

          <div className="hidden items-center justify-center gap-4 lg:flex lg:gap-6">
            <Link
              to={"/"}
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
              Home
            </Link>

            <UserButton />
          </div>

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close dashboard navigation"
                : "Open dashboard navigation"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="
              flex
              size-10
              items-center
              justify-center
              rounded-2xl
              border
              border-primary/15
              bg-primary/4
              text-white
              shadow-lg
              shadow-primary/5
              transition-all
              duration-200
              hover:border-primary/30
              hover:bg-primary/9
              lg:hidden
            "
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="
              absolute
              left-0
              right-0
              top-[calc(100%+0.75rem)]
              max-h-[calc(100vh-7rem)]
              overflow-y-auto
              rounded-3xl
              border
              border-white/10
              bg-background/95
              p-3
              shadow-2xl
              shadow-black/50
              backdrop-blur-xl
              lg:hidden
            "
          >
            <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/4 p-4">
              <UserButton />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.fullName ?? user?.firstName ?? "Your account"}
                </p>

                <p className="mt-0.5 truncate text-xs text-white/40">
                  {user?.primaryEmailAddress?.emailAddress ?? ""}
                </p>
              </div>
            </div>

            <nav className="mt-3 space-y-1">
              {dashboardLinks.map((link) => {
                const Icon = link.icon;
                const active = isActiveRoute(link.href);

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200",
                      active
                        ? "border-primary/20 bg-primary/8"
                        : "border-transparent hover:border-white/10 hover:bg-white/4",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "bg-white/4 text-white/50",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          active ? "text-white" : "text-white/70",
                        )}
                      >
                        {link.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-white/35">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
