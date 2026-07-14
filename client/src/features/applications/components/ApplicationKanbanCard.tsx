import { CalendarDays, MapPin } from "lucide-react";
import type { DragEvent } from "react";
import { Link } from "react-router-dom";

import type { JobApplication } from "../application.types";

type ApplicationKanbanCardProps = {
  application: JobApplication;
  disabled?: boolean;
  onDragStart: (event: DragEvent<HTMLElement>, applicationId: string) => void;
  onDragEnd: () => void;
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(parsedDate);
}

export function ApplicationKanbanCard({
  application,
  disabled,
  onDragStart,
  onDragEnd,
}: ApplicationKanbanCardProps) {
  const appliedDate = formatDate(application.appliedAt);

  const followUpDate = formatDate(application.followUpDate);

  return (
    <article
      draggable={!disabled}
      onDragStart={(event) => onDragStart(event, application.id)}
      onDragEnd={onDragEnd}
      className={[
        "rounded-2xl border border-white/10 bg-background/80 p-4",
        "transition-all duration-200",
        disabled
          ? "cursor-wait opacity-60"
          : "cursor-grab hover:border-primary/25 hover:bg-primary/[0.03] active:cursor-grabbing",
      ].join(" ")}
    >
      <Link
        to={`/dashboard/applications/${application.id}`}
        className="block"
        draggable={false}
      >
        <p className="truncate text-xs font-medium uppercase tracking-wide text-primary">
          {application.company}
        </p>

        <h3 className="mt-2 line-clamp-2 font-semibold leading-6 text-white">
          {application.role}
        </h3>

        {application.location && (
          <p className="mt-3 flex items-center gap-2 text-xs text-white/45">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{application.location}</span>
          </p>
        )}

        {(appliedDate || followUpDate) && (
          <div className="mt-4 space-y-2 border-t border-white/10 pt-3">
            {appliedDate && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 text-white/40">
                  <CalendarDays className="size-3.5" />
                  Applied
                </span>

                <span className="text-white/65">{appliedDate}</span>
              </div>
            )}

            {followUpDate && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-white/40">Follow-up</span>

                <span className="text-white/65">{followUpDate}</span>
              </div>
            )}
          </div>
        )}
      </Link>
    </article>
  );
}
