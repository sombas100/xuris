import type { ApplicationStatusHistory } from "../application.types";

type ApplicationTimelineProps = {
  history: ApplicationStatusHistory[];
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function ApplicationTimeline({ history }: ApplicationTimelineProps) {
  return (
    <ol className="space-y-5">
      {history.map((item) => (
        <li key={item.id} className="relative border-l border-white/10 pl-6">
          <span className="absolute -left-1.5 top-1.5 size-3 rounded-full bg-primary" />

          <p className="font-medium text-white">
            {item.fromStatus
              ? `${formatStatus(item.fromStatus)} → ${formatStatus(
                  item.toStatus,
                )}`
              : formatStatus(item.toStatus)}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {formatDate(item.changedAt)}
          </p>

          {item.note && (
            <p className="mt-2 text-sm leading-6 text-white/55">{item.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
