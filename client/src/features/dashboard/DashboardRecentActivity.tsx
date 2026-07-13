import { FileSearch, Scale } from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardActivity } from "@/features/dashboard/dashboard.types";

type DashboardRecentActivityProps = {
  activities: DashboardActivity[];
};

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

export default function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10">
        <p className="text-white/40">
          Your recent AI analyses will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = activity.type === "RESUME_ANALYSIS" ? FileSearch : Scale;

        const destination =
          activity.type === "RESUME_ANALYSIS" && activity.resumeId
            ? `/dashboard/resume-analysis?resumeId=${activity.resumeId}&analysisId=${activity.id}`
            : "#";

        return (
          <Link
            key={activity.id}
            to={destination}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/2 p-4 transition-colors hover:border-primary/20 hover:bg-white/4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-white">{activity.title}</p>

                {activity.score !== null && (
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    {activity.score}/100
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-white/50">
                {activity.description}
              </p>

              <p className="mt-2 text-xs text-white/35">
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
