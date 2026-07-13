import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useDeleteResume } from "../hooks/use-delete-resume";
import type { Resume } from "../resume.types";
import { ResumeStatusBadge } from "./ResumeStatusBadge";

type ResumeCardProps = {
  resume: Resume;
};

type StatusBadge = {
  label: string;
  className: string;
  dotClassName: string;
};

function formatFileSize(bytes: number | null) {
  if (bytes === null) {
    return "Unknown size";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatFileType(mimeType: string | null) {
  switch (mimeType) {
    case "application/pdf":
      return "PDF";

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";

    default:
      return "Unknown";
  }
}

function getStatusBadge(status: Resume["status"]): StatusBadge {
  switch (status) {
    case "UPLOADED":
      return {
        label: "Processing",
        className: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        dotClassName: "animate-pulse bg-blue-400",
      };

    case "EXTRACTED":
      return {
        label: "Ready",
        className: "border-green-500/20 bg-green-500/10 text-green-300",
        dotClassName: "bg-green-400",
      };

    case "FAILED":
      return {
        label: "Failed",
        className: "border-red-500/20 bg-red-500/10 text-red-300",
        dotClassName: "bg-red-400",
      };

    default:
      return {
        label: status,
        className: "border-white/10 bg-white/5 text-white/60",
        dotClassName: "bg-white/40",
      };
  }
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const deleteMutation = useDeleteResume();
  const statusBadge = getStatusBadge(resume.status);

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(resume.id, {
      onSuccess: () => {
        toast.success("Resume deleted", {
          description: `${resume.title} has been removed.`,
        });
      },

      onError: (error) => {
        toast.error("Could not delete resume", {
          description: error.message,
        });
      },
    });
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">
            {resume.title}
          </h3>

          <p className="mt-1 truncate text-sm text-white/45">
            {resume.originalName}
          </p>
        </div>

        <ResumeStatusBadge status={resume.status} />
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-white/40">File size</dt>

          <dd className="text-white/70">{formatFileSize(resume.fileSize)}</dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-white/40">Uploaded</dt>

          <dd className="text-white/70">{formatDate(resume.createdAt)}</dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-white/40">File type</dt>

          <dd className="text-white/70">{formatFileType(resume.mimeType)}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/dashboard/resumes/${resume.id}`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          View resume
        </Link>

        <Button
          type="button"
          variant="destructive"
          className="cursor-pointer bg-gray-300 transition-colors hover:bg-gray-500"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </article>
  );
}
