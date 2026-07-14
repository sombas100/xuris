import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import type { JobApplication } from "../application.types";

type ApplicationCardProps = {
  application: JobApplication;
};

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
  }).format(parsedDate);
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-background/50 p-6 transition-colors hover:border-primary/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-primary">
            <BriefcaseBusiness className="size-4" />
            {application.company}
          </div>

          <h2 className="mt-2 truncate text-xl font-semibold text-white">
            {application.role}
          </h2>

          {application.location && (
            <p className="mt-2 flex items-center gap-2 text-sm text-white/45">
              <MapPin className="size-4" />
              {application.location}
            </p>
          )}
        </div>

        <ApplicationStatusBadge status={application.status} />
      </div>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-white/40">Applied</dt>

          <dd className="mt-1 text-white/70">
            {formatDate(application.appliedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-white/40">Follow-up</dt>

          <dd className="mt-1 text-white/70">
            {formatDate(application.followUpDate)}
          </dd>
        </div>
      </dl>

      {application.notes && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-white/50">
          {application.notes}
        </p>
      )}

      <div className="mt-auto pt-6">
        <Link
          to={`/dashboard/applications/${application.id}`}
          className={cn(
            buttonVariants({
              variant: "secondaryAction",
            }),
            "w-full",
          )}
        >
          View application
        </Link>
      </div>
    </article>
  );
}
