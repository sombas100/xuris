import { FileText, History } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CoverLetter } from "../cover-letter.types";

type CoverLetterHistoryProps = {
  coverLetters: CoverLetter[];
  selectedCoverLetterId: string | null;
  disabled?: boolean;
  onSelect: (coverLetterId: string) => void;
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

export function CoverLetterHistory({
  coverLetters,
  selectedCoverLetterId,
  disabled,
  onSelect,
}: CoverLetterHistoryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <History className="size-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Generation history
          </h2>

          <p className="mt-1 text-sm text-white/45">
            Review previous letters for this role.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {coverLetters.map((coverLetter, index) => {
          const selected = coverLetter.id === selectedCoverLetterId;

          return (
            <button
              key={coverLetter.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(coverLetter.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-primary/30 bg-primary/10"
                  : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4",
              )}
            >
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-primary" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {index === 0 ? "Latest cover letter" : coverLetter.title}
                  </p>

                  {coverLetter.tone && (
                    <p className="mt-1 truncate text-xs text-white/45">
                      {coverLetter.tone}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs text-white/35">
                {formatDate(coverLetter.createdAt)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
