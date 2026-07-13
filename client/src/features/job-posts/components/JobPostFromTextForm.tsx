import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { JobPostProcessingModal } from "./JobPostProcessingModal";
import { useCreateJobPostFromText } from "../hooks/use-create-job-post-from-text";
import type { JobPost } from "../job-post.types";

type JobPostFromTextFormProps = {
  onCreated: (jobPost: JobPost) => void;
};

export function JobPostFromTextForm({ onCreated }: JobPostFromTextFormProps) {
  const [rawText, setRawText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMutation = useCreateJobPostFromText();

  function handleSubmit() {
    const trimmedText = rawText.trim();

    setValidationError(null);

    if (trimmedText.length < 100) {
      setValidationError("Paste at least 100 characters from the job advert.");
      return;
    }

    createMutation.mutate(trimmedText, {
      onSuccess: (response) => {
        setRawText("");
        onCreated(response.data);

        toast.success("Job advert saved", {
          description: `${response.data.title}${
            response.data.company ? ` at ${response.data.company}` : ""
          } is ready for comparison.`,
        });
      },

      onError: (error) => {
        toast.error("Could not process job advert", {
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <JobPostProcessingModal open={createMutation.isPending} />

      <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <FilePlus2 className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Paste a job advert
            </h2>

            <p className="mt-1 text-sm text-white/45">
              Xuris will extract the important job details automatically.
            </p>
          </div>
        </div>

        <textarea
          value={rawText}
          disabled={createMutation.isPending}
          placeholder="Paste the full job advert here..."
          onChange={(event) => {
            setRawText(event.target.value);
            setValidationError(null);
            createMutation.reset();
          }}
          className="mt-6 min-h-72 w-full resize-y rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            {rawText.trim().length} characters
          </p>

          <Button
            type="button"
            className="cursor-pointer"
            disabled={createMutation.isPending || rawText.trim().length < 100}
            onClick={handleSubmit}
          >
            {createMutation.isPending ? "Processing..." : "Process job advert"}
          </Button>
        </div>

        {validationError && (
          <p className="mt-3 text-sm text-destructive">{validationError}</p>
        )}
      </section>
    </>
  );
}
