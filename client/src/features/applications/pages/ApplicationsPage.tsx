import { LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ApplicationCard } from "../components/ApplicationCard";
import { ApplicationCreateForm } from "../components/ApplicationCreateForm";
import { ApplicationKanbanBoard } from "../components/ApplicationKanbanBoard";
import { useApplications } from "../hooks/use-applications";
import type { ApplicationStatus } from "../application.types";

type ApplicationView = "list" | "board";

export function ApplicationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [view, setView] = useState<ApplicationView>("list");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<ApplicationStatus | "">("");

  const { data, isPending, isError, error } = useApplications({
    search: search || undefined,
    status: status || undefined,
    sort: "updatedAt",
    order: "desc",
    page: 1,
    limit: 100,
  });

  return (
    <DashboardContent>
      <div className="space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Applications
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Track applications, interviews, follow-ups and outcomes in one
              place.
            </p>
          </div>

          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowCreateForm((current) => !current)}
          >
            <Plus className="size-4" />

            {showCreateForm ? "Close form" : "Add application"}
          </Button>
        </header>

        {showCreateForm && (
          <ApplicationCreateForm onSuccess={() => setShowCreateForm(false)} />
        )}

        <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <input
                value={search}
                placeholder="Search company, role or location..."
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-background px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50"
              />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ApplicationStatus | "")
                }
                className="h-11 rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none focus:border-primary/50"
              >
                <option value="">All statuses</option>

                <option value="SAVED">Saved</option>

                <option value="APPLIED">Applied</option>

                <option value="SCREENING">Screening</option>

                <option value="INTERVIEW">Interview</option>

                <option value="TECHNICAL_TEST">Technical test</option>

                <option value="FINAL_INTERVIEW">Final interview</option>

                <option value="OFFER">Offer</option>

                <option value="REJECTED">Rejected</option>

                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <div className="inline-flex w-fit rounded-xl border border-white/10 bg-black/15 p-1">
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                <List className="size-4" />
                List
              </button>

              <button
                type="button"
                aria-label="Board view"
                aria-pressed={view === "board"}
                onClick={() => setView("board")}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                  view === "board"
                    ? "bg-primary text-primary-foreground"
                    : "text-white/50 hover:bg-white/5 hover:text-white",
                )}
              >
                <LayoutGrid className="size-4" />
                Board
              </button>
            </div>
          </div>
        </section>

        {isPending && (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl border border-white/10 bg-background/50"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
            {error.message}
          </div>
        )}

        {data && data.applications.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
            <h2 className="text-lg font-semibold text-white">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Add your first application or adjust the current filters.
            </p>
          </div>
        )}

        {data && data.applications.length > 0 && view === "list" && (
          <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {data.applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </section>
        )}

        {data && data.applications.length > 0 && view === "board" && (
          <ApplicationKanbanBoard applications={data.applications} />
        )}
      </div>
    </DashboardContent>
  );
}
