import { useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  FilePenLine,
  FileSearch,
  Files,
  Infinity as InfinityIcon,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Scale,
  Sparkles,
  X,
} from "lucide-react";

import { useUsageSummary } from "@/features/billing/hooks/use-usage-summary";
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

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(parsedDate);
}

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useUser();
  const location = useLocation();

  const { data: usage, isPending: isUsagePending } = useUsageSummary();

  function isActiveRoute(href: string) {
    if (href === "/dashboard") {
      return location.pathname === href;
    }

    return location.pathname.startsWith(href);
  }

  const usageLimit = usage?.usageLimit ?? 5;

  const usagePercentage =
    usage && !usage.unlimited
      ? Math.min((usage.usageCount / usageLimit) * 100, 100)
      : 0;

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

          <div className="hidden items-center justify-center gap-4 lg:flex">
            {isUsagePending ? (
              <div className="h-10 w-40 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
            ) : usage ? (
              <Link
                to="/dashboard/billing"
                className="
                  group/usage
                  flex
                  min-w-40
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-2
                  transition-all
                  duration-200
                  hover:border-primary/30
                  hover:bg-primary/[8
                  hover:shadow-[0_0_20px_rgba(204,93,232,0.12)]
                "
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {usage.unlimited ? (
                    <InfinityIcon className="size-4" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-medium text-white/70">
                      {usage.unlimited
                        ? "Unlimited AI usage"
                        : `${usage.remaining ?? 0} uses remaining`}
                    </p>

                    {!usage.unlimited && (
                      <span className="text-[10px] text-white/35">
                        {usage.usageCount}/{usageLimit}
                      </span>
                    )}
                  </div>

                  {!usage.unlimited && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-all duration-500"
                        style={{
                          width: `${usagePercentage}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            ) : null}

            <Link
              to="/"
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

            <Link
              to="/dashboard/billing"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 block rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/8"
            >
              {isUsagePending ? (
                <div className="h-16 animate-pulse rounded-xl bg-white/5" />
              ) : usage ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {usage.unlimited ? (
                          <InfinityIcon className="size-5" />
                        ) : (
                          <Sparkles className="size-5" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {usage.unlimited
                            ? "Unlimited AI usage"
                            : "Monthly AI usage"}
                        </p>

                        <p className="mt-0.5 text-xs text-white/40">
                          {usage.unlimited
                            ? "Included with your current plan"
                            : `${usage.remaining ?? 0} of ${usageLimit} generations remaining`}
                        </p>
                      </div>
                    </div>

                    {!usage.unlimited && (
                      <span className="text-xs font-medium text-white/50">
                        {usage.usageCount}/{usageLimit}
                      </span>
                    )}
                  </div>

                  {!usage.unlimited && (
                    <>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-all duration-500"
                          style={{
                            width: `${usagePercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-[11px] text-white/35">
                        Resets {formatDate(usage.usageResetDate)}
                      </p>
                    </>
                  )}
                </>
              ) : null}
            </Link>

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
