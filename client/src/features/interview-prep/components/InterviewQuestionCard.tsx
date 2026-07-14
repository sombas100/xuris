import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "../interview-prep.types";

type InterviewQuestionCardProps = {
  question: InterviewQuestion;
  number: number;
};

export function InterviewQuestionCard({
  question,
  number,
}: InterviewQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const answer =
    question.suggestedAnswer ?? question.exampleAnswer ?? question.guidance;

  const hasGuidance =
    Boolean(answer) ||
    Boolean(question.whyAsked) ||
    Boolean(question.keyPoints?.length);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/2">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
        onClick={() => setExpanded((current) => !current)}
      >
        <div className="flex gap-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {number}
          </span>

          <p className="pt-1 text-sm font-medium leading-6 text-white">
            {question.question}
          </p>
        </div>

        {hasGuidance && (
          <ChevronDown
            className={cn(
              "mt-1 size-4 shrink-0 text-white/40 transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {expanded && hasGuidance && (
        <div className="border-t border-white/10 px-5 pb-5 pt-4">
          {question.whyAsked && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Why they may ask this
              </p>

              <p className="mt-2 text-sm leading-6 text-white/60">
                {question.whyAsked}
              </p>
            </div>
          )}

          {answer && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Suggested approach
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/65">
                {answer}
              </p>
            </div>
          )}

          {question.keyPoints && question.keyPoints.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Key points
              </p>

              <ul className="mt-2 space-y-2">
                {question.keyPoints.map((point, index) => (
                  <li
                    key={`${point}-${index}`}
                    className="flex gap-3 text-sm leading-6 text-white/60"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
