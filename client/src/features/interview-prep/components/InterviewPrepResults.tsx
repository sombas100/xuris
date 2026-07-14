import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  Code2,
  Lightbulb,
  MessageCircleQuestion,
  MessagesSquare,
  Target,
  TriangleAlert,
} from "lucide-react";

import type { JobPost } from "@/features/job-posts/job-post.types";

import { InterviewPrepList } from "./InterviewPrepList";
import { InterviewQuestionSection } from "./InterviewQuestionSection";
import type { InterviewPrep } from "../interview-prep.types";

type InterviewPrepResultsProps = {
  interviewPrep: InterviewPrep;
  jobPost?: JobPost;
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

function formatDifficulty(difficulty: InterviewPrep["difficulty"]) {
  if (!difficulty) {
    return "Not specified";
  }

  return difficulty
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function InterviewPrepResults({
  interviewPrep,
  jobPost,
}: InterviewPrepResultsProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Interview preparation
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              {jobPost?.title ?? "Personalised interview session"}
            </h2>

            {jobPost?.company && (
              <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                <BriefcaseBusiness className="size-4" />
                {jobPost.company}
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <Target className="size-4" />
              {formatDifficulty(interviewPrep.difficulty)}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(interviewPrep.createdAt)}
            </div>

            {interviewPrep.modelUsed && (
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                {interviewPrep.modelUsed}
              </div>
            )}
          </div>
        </div>

        {interviewPrep.summary && (
          <p className="mt-6 max-w-4xl leading-7 text-white/65">
            {interviewPrep.summary}
          </p>
        )}
      </section>

      <InterviewQuestionSection
        title="Technical questions"
        description="Questions that assess relevant technical knowledge and problem solving."
        icon={Code2}
        questions={interviewPrep.technicalQuestions}
      />

      <InterviewQuestionSection
        title="Behavioural questions"
        description="Questions about communication, teamwork, ownership and past experiences."
        icon={MessagesSquare}
        questions={interviewPrep.behaviouralQuestions}
      />

      <InterviewQuestionSection
        title="Role-specific questions"
        description="Questions tailored directly to the selected position."
        icon={MessageCircleQuestion}
        questions={interviewPrep.roleSpecificQuestions}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <InterviewPrepList
          title="Weakness areas to prepare"
          icon={TriangleAlert}
          tone="warning"
          items={interviewPrep.weaknessAreas}
          emptyMessage="No major weakness areas were identified."
        />

        <InterviewPrepList
          title="Questions to ask"
          icon={CircleHelp}
          tone="positive"
          items={interviewPrep.questionsToAsk}
          emptyMessage="No interviewer questions were generated."
        />
      </div>

      <InterviewPrepList
        title="Preparation tips"
        icon={Lightbulb}
        tone="neutral"
        items={interviewPrep.tips}
        emptyMessage="No additional preparation tips were generated."
      />
    </div>
  );
}
