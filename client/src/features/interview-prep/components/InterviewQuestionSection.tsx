import type { LucideIcon } from "lucide-react";

import { InterviewQuestionCard } from "./InterviewQuestionCard";
import type { InterviewQuestion } from "../interview-prep.types";

type InterviewQuestionSectionProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  questions: InterviewQuestion[] | null;
};

export function InterviewQuestionSection({
  title,
  description,
  icon: Icon,
  questions,
}: InterviewQuestionSectionProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>

          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>
      </div>

      {questions && questions.length > 0 ? (
        <div className="mt-6 space-y-3">
          {questions.map((question, index) => (
            <InterviewQuestionCard
              key={`${question.question}-${index}`}
              question={question}
              number={index + 1}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-white/40">
          No questions were generated for this section.
        </p>
      )}
    </section>
  );
}
