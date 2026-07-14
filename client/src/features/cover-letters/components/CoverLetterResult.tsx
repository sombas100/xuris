import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clipboard,
  Download,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { JobPost } from "@/features/job-posts/job-post.types";

import type { CoverLetter } from "../cover-letter.types";

type CoverLetterResultProps = {
  coverLetter: CoverLetter;
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

function createFileName(title: string) {
  const safeTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeTitle || "cover-letter"}.txt`;
}

export function CoverLetterResult({
  coverLetter,
  jobPost,
}: CoverLetterResultProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coverLetter.content);

      setCopied(true);

      toast.success("Cover letter copied", {
        description: "The letter has been copied to your clipboard.",
      });

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Could not copy cover letter");
    }
  }

  function handleDownload() {
    const blob = new Blob([coverLetter.content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = createFileName(coverLetter.title);

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    toast.success("Cover letter downloaded");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              Generated cover letter
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              {coverLetter.title}
            </h2>

            {jobPost && (
              <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                <BriefcaseBusiness className="size-4" />

                {jobPost.title}
                {jobPost.company ? ` at ${jobPost.company}` : ""}
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs text-white/40">
            {coverLetter.tone && (
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                {coverLetter.tone}
              </div>
            )}

            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formatDate(coverLetter.createdAt)}
            </div>

            {coverLetter.modelUsed && (
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                {coverLetter.modelUsed}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondaryAction"
            className="cursor-pointer"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Clipboard className="size-4" />
            )}

            {copied ? "Copied" : "Copy letter"}
          </Button>

          <Button
            type="button"
            variant="secondaryAction"
            className="cursor-pointer"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            Download .txt
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Cover letter content
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Review and copy your tailored letter.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-6 sm:p-8">
          <div className="whitespace-pre-wrap text-sm leading-8 text-white/75">
            {coverLetter.content}
          </div>
        </div>
      </section>
    </div>
  );
}
