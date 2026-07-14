import { FilePenLine, FileSearch, MessagesSquare, Scale } from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardActivity } from "@/features/dashboard/dashboard.types";

type DashboardRecentActivityProps = {
  activities: DashboardActivity[];
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function getActivityIcon(type: DashboardActivity["type"]) {
  switch (type) {
    case "RESUME_ANALYSIS":
      return FileSearch;

    case "JOB_COMPARISON":
      return Scale;

    case "INTERVIEW_PREP":
      return MessagesSquare;

    case "COVER_LETTER":
      return FilePenLine;
  }
}

function getActivityDestination(activity: DashboardActivity) {
  const resumeId = activity.resumeId
    ? encodeURIComponent(activity.resumeId)
    : null;

  const jobPostId = activity.jobPostId
    ? encodeURIComponent(activity.jobPostId)
    : null;

  const activityId = encodeURIComponent(activity.id);

  switch (activity.type) {
    case "RESUME_ANALYSIS":
      if (!resumeId) {
        return "/dashboard/resume-analysis";
      }

      return `/dashboard/resume-analysis?resumeId=${resumeId}&analysisId=${activityId}`;

    case "JOB_COMPARISON":
      if (!resumeId) {
        return "/dashboard/job-comparison";
      }

      return `/dashboard/job-comparison?resumeId=${resumeId}${
        jobPostId ? `&jobPostId=${jobPostId}` : ""
      }&comparisonId=${activityId}`;

    case "INTERVIEW_PREP":
      if (!resumeId || !jobPostId) {
        return "/dashboard/interview-prep";
      }

      return `/dashboard/interview-prep?resumeId=${resumeId}&jobPostId=${jobPostId}&interviewPrepId=${activityId}`;

    case "COVER_LETTER":
      if (!resumeId || !jobPostId) {
        return "/dashboard/cover-letters";
      }

      return `/dashboard/cover-letters?resumeId=${resumeId}&jobPostId=${jobPostId}&coverLetterId=${activityId}`;
  }
}

export default function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10">
        <p className="max-w-sm text-center text-sm text-white/40">
          Your recent resume analyses, job comparisons, interview sessions and
          cover letters will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        const destination = getActivityDestination(activity);

        return (
          <Link
            key={`${activity.type}-${activity.id}`}
            to={destination}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/2 p-4 transition-all duration-200 hover:border-primary/20 hover:bg-primary/3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-white">{activity.title}</p>

                {activity.score !== null && (
                  <span className="shrink-0 rounded-lg border border-primary/15 bg-primary/6 px-2 py-1 text-xs font-semibold text-primary">
                    {activity.score}/100
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm leading-6 text-white/50">
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
