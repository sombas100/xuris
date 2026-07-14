import type { DragEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { ApplicationKanbanCard } from "./ApplicationKanbanCard";
import { useMoveApplicationStatus } from "../hooks/use-move-application-status";
import type { ApplicationStatus, JobApplication } from "../application.types";

type ApplicationKanbanBoardProps = {
  applications: JobApplication[];
};

type KanbanColumn = {
  status: ApplicationStatus;
  title: string;
  description: string;
};

const columns: KanbanColumn[] = [
  {
    status: "SAVED",
    title: "Saved",
    description: "Roles being considered",
  },
  {
    status: "APPLIED",
    title: "Applied",
    description: "Applications submitted",
  },
  {
    status: "SCREENING",
    title: "Screening",
    description: "Recruiter or initial review",
  },
  {
    status: "INTERVIEW",
    title: "Interview",
    description: "Active interview stage",
  },
  {
    status: "TECHNICAL_TEST",
    title: "Technical test",
    description: "Assessments and take-home work",
  },
  {
    status: "FINAL_INTERVIEW",
    title: "Final interview",
    description: "Final hiring stage",
  },
  {
    status: "OFFER",
    title: "Offer",
    description: "Offers received",
  },
  {
    status: "REJECTED",
    title: "Rejected",
    description: "Applications not progressing",
  },
  {
    status: "WITHDRAWN",
    title: "Withdrawn",
    description: "Applications you withdrew",
  },
];

export function ApplicationKanbanBoard({
  applications,
}: ApplicationKanbanBoardProps) {
  const [localApplications, setLocalApplications] = useState(applications);

  const [draggedApplicationId, setDraggedApplicationId] = useState<
    string | null
  >(null);

  const [activeColumn, setActiveColumn] = useState<ApplicationStatus | null>(
    null,
  );

  const moveMutation = useMoveApplicationStatus();

  useEffect(() => {
    setLocalApplications(applications);
  }, [applications]);

  const applicationsByStatus = useMemo(() => {
    const grouped = new Map<ApplicationStatus, JobApplication[]>();

    for (const column of columns) {
      grouped.set(column.status, []);
    }

    for (const application of localApplications) {
      grouped.get(application.status)?.push(application);
    }

    return grouped;
  }, [localApplications]);

  function handleDragStart(
    event: DragEvent<HTMLElement>,
    applicationId: string,
  ) {
    setDraggedApplicationId(applicationId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", applicationId);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
    status: ApplicationStatus,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    setActiveColumn(status);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget as Node | null;

    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }

    setActiveColumn(null);
  }

  function handleDragEnd() {
    setDraggedApplicationId(null);
    setActiveColumn(null);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    newStatus: ApplicationStatus,
  ) {
    event.preventDefault();

    const applicationId =
      event.dataTransfer.getData("text/plain") || draggedApplicationId;

    setActiveColumn(null);
    setDraggedApplicationId(null);

    if (!applicationId) {
      return;
    }

    const application = localApplications.find(
      (item) => item.id === applicationId,
    );

    if (!application || application.status === newStatus) {
      return;
    }

    const previousApplications = localApplications;

    setLocalApplications((current) =>
      current.map((item) =>
        item.id === applicationId
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    moveMutation.mutate(
      {
        applicationId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          const column = columns.find((item) => item.status === newStatus);

          toast.success("Application status updated", {
            description: `${application.role} at ${application.company} moved to ${
              column?.title ?? newStatus
            }.`,
          });
        },

        onError: (error) => {
          setLocalApplications(previousApplications);

          toast.error("Could not move application", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-white/45">
          Drag applications between columns to update their status.
        </p>

        {moveMutation.isPending && (
          <p className="text-xs text-primary">Saving change...</p>
        )}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5">
          {columns.map((column) => {
            const columnApplications =
              applicationsByStatus.get(column.status) ?? [];

            const isActive = activeColumn === column.status;

            return (
              <div
                key={column.status}
                onDragOver={(event) => handleDragOver(event, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(event) => handleDrop(event, column.status)}
                className={cn(
                  "flex w-80 shrink-0 flex-col rounded-3xl border p-4 transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/[0.07]"
                    : "border-white/10 bg-background/50",
                )}
              >
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-white">{column.title}</h2>

                    <span className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/4 text-xs font-medium text-white/60">
                      {columnApplications.length}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-white/40">
                    {column.description}
                  </p>
                </div>

                <div className="mt-4 min-h-40 space-y-3">
                  {columnApplications.length === 0 ? (
                    <div
                      className={cn(
                        "flex min-h-32 items-center justify-center rounded-2xl border border-dashed p-4 text-center",
                        isActive
                          ? "border-primary/30 bg-primary/4"
                          : "border-white/10",
                      )}
                    >
                      <p className="text-xs leading-5 text-white/35">
                        Drop an application here
                      </p>
                    </div>
                  ) : (
                    columnApplications.map((application) => (
                      <ApplicationKanbanCard
                        key={application.id}
                        application={application}
                        disabled={moveMutation.isPending}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
