import { ArrowLeft, ExternalLink, Trash2, Pencil } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ApplicationStatusBadge } from "../components/ApplicationStatusBadge";
import { ApplicationTimeline } from "../components/ApplicationTimeline";
import { useApplication } from "../hooks/use-application";
import { useDeleteApplication } from "../hooks/use-delete-application";
import { useUpdateApplicationStatus } from "../hooks/use-update-application-status";
import { ApplicationEditForm } from "../components/ApplicationEditForm";
import type { ApplicationStatus } from "../application.types";
import { useState } from "react";

export function ApplicationDetailsPage() {
  const [editing, setEditing] = useState(false);
  const { applicationId } = useParams<{
    applicationId: string;
  }>();

  const navigate = useNavigate();

  const {
    data: application,
    isPending,
    isError,
    error,
  } = useApplication(applicationId);

  const statusMutation = useUpdateApplicationStatus(applicationId ?? "");

  const deleteMutation = useDeleteApplication();

  if (isPending) {
    return (
      <DashboardContent>
        <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
      </DashboardContent>
    );
  }

  if (isError || !application) {
    return (
      <DashboardContent>
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8">
          <h1 className="text-xl font-semibold text-destructive">
            Application could not be loaded
          </h1>

          <p className="mt-2 text-white/50">
            {error?.message ?? "The application was not found."}
          </p>
        </div>
      </DashboardContent>
    );
  }

  function handleStatusChange(status: ApplicationStatus) {
    statusMutation.mutate(
      {
        status,
        note: `Status changed to ${status.toLowerCase().replaceAll("_", " ")}.`,
      },
      {
        onSuccess: () => {
          toast.success("Application status updated");
        },

        onError: (mutationError) => {
          toast.error("Could not update status", {
            description: mutationError.message,
          });
        },
      },
    );
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete the application for ${application?.role} at ${application?.company}?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(application!.id, {
      onSuccess: () => {
        toast.success("Application deleted");

        navigate("/dashboard/applications", {
          replace: true,
        });
      },

      onError: (deleteError) => {
        toast.error("Could not delete application", {
          description: deleteError.message,
        });
      },
    });
  }

  return (
    <DashboardContent>
      <div className="space-y-8">
        <header>
          {editing && (
            <ApplicationEditForm
              application={application}
              onCancel={() => setEditing(false)}
              onSuccess={() => setEditing(false)}
            />
          )}
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to applications
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-primary">{application.company}</p>

              <h1 className="mt-2 text-3xl font-semibold text-white">
                {application.role}
              </h1>

              <div className="mt-4">
                <ApplicationStatusBadge status={application.status} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {application.jobUrl && (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({
                      variant: "secondaryAction",
                    }),
                  )}
                >
                  <ExternalLink className="size-4" />
                  Open job advert
                </a>
              )}

              <Button
                type="button"
                variant="secondaryAction"
                className="cursor-pointer"
                onClick={() => setEditing((current) => !current)}
              >
                <Pencil className="size-4" />
                {editing ? "Close editor" : "Edit application"}
              </Button>

              <Button
                type="button"
                variant="secondaryAction"
                className="cursor-pointer"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
              <h2 className="text-lg font-semibold text-white">
                Update status
              </h2>

              <select
                value={application.status}
                disabled={statusMutation.isPending}
                onChange={(event) =>
                  handleStatusChange(event.target.value as ApplicationStatus)
                }
                className="mt-5 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none focus:border-primary/50"
              >
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
            </section>

            <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
              <h2 className="text-lg font-semibold text-white">Notes</h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                {application.notes || "No notes have been added."}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
              <h2 className="text-lg font-semibold text-white">
                Status history
              </h2>

              <div className="mt-6">
                <ApplicationTimeline
                  history={application.statusHistory ?? []}
                />
              </div>
            </section>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-background/50 p-6">
            <h2 className="text-lg font-semibold text-white">
              Application details
            </h2>

            <dl className="mt-6 space-y-4 text-sm">
              <DetailRow label="Company" value={application.company} />

              <DetailRow label="Role" value={application.role} />

              <DetailRow label="Location" value={application.location} />

              <DetailRow label="Salary" value={application.salary} />

              <DetailRow label="Resume" value={application.resume?.title} />

              <DetailRow
                label="Cover letter"
                value={application.coverLetter?.title}
              />

              <DetailRow
                label="Applied"
                value={formatDate(application.appliedAt)}
              />

              <DetailRow
                label="Interview"
                value={formatDate(application.interviewAt)}
              />

              <DetailRow
                label="Follow-up"
                value={formatDate(application.followUpDate)}
              />
            </dl>
          </aside>
        </section>
      </div>
    </DashboardContent>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-white/40">{label}</dt>

      <dd className="max-w-[60%] text-right text-white/70">
        {value || "Not set"}
      </dd>
    </div>
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not set";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}
