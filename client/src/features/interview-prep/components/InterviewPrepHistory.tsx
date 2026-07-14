import { History, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import type { InterviewPrep } from "../interview-prep.types";

type InterviewPrepHistoryProps = {
  interviewPreps: InterviewPrep[];
  selectedInterviewPrepId: string | null;
  disabled?: boolean;
  onSelect: (interviewPrepId: string) => void;
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

export function InterviewPrepHistory({
  interviewPreps,
  selectedInterviewPrepId,
  disabled,
  onSelect,
}: InterviewPrepHistoryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <History className="size-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Session history</h2>

          <p className="mt-1 text-sm text-white/45">
            Review previous preparation sessions.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {interviewPreps.map((interviewPrep, index) => {
          const selected = interviewPrep.id === selectedInterviewPrepId;

          return (
            <button
              key={interviewPrep.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(interviewPrep.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">
                  {index === 0 ? "Latest session" : "Previous session"}
                </p>

                {interviewPrep.difficulty && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <Target className="size-3.5" />
                    {interviewPrep.difficulty.replaceAll("_", " ")}
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-white/35">
                {formatDate(interviewPrep.createdAt)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
