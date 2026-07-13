import { ArrowLeft, Download, FileText, Sparkles, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ResumeStatusBadge } from "../components/ResumeStatusBadge";
import { useDeleteResume } from "../hooks/use-delete-resume";
import { useResume } from "../hooks/use-resume";

function formatFileSize(bytes: number | null) {
  if (bytes === null) {
    return "Unknown";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
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

export function ResumeDetailsPage() {
  const { resumeId } = useParams<{
    resumeId: string;
  }>();

  const navigate = useNavigate();

  const {
    data: resume,
    isPending,
    isError,
    error,
    refetch,
  } = useResume(resumeId);

  const deleteMutation = useDeleteResume();

  function handleDelete() {
    if (!resume) {
      return;
    }

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

        navigate("/dashboard/resumes", {
          replace: true,
        });
      },

      onError: (deleteError) => {
        toast.error("Could not delete resume", {
          description: deleteError.message,
        });
      },
    });
  }

  if (isPending) {
    return (
      <DashboardContent>
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-background/50 lg:col-span-2" />
            <div className="h-72 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
          </div>
        </div>
      </DashboardContent>
    );
  }

  if (isError || !resume) {
    return (
      <DashboardContent>
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8">
          <h1 className="text-xl font-semibold text-destructive">
            We could not load this resume
          </h1>

          <p className="mt-2 text-sm text-white/50">
            {error?.message ?? "The requested resume could not be found."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => refetch()}>
              Try again
            </Button>

            <Link
              to="/dashboard/resumes"
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
              )}
            >
              Back to resumes
            </Link>
          </div>
        </div>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <div className="space-y-8">
        <header>
          <Link
            to="/dashboard/resumes"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to resumes
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-3xl font-semibold tracking-tight text-white">
                  {resume.title}
                </h1>

                <ResumeStatusBadge status={resume.status} />
              </div>

              <p className="mt-3 text-white/50">
                View the extracted content and use this resume throughout Xuris.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-text">
              <Button
                className={"hover:text-gray-500 transition-colors"}
                variant={"ghost"}
              >
                <a
                  href={resume.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                  )}
                >
                  <Download className="size-4" />
                  Download
                </a>
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
                className={
                  "bg-gray-600 hover:bg-gray-800 transition-colors cursor-pointer"
                }
              >
                <Trash2 className="size-4" />

                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </header>

        <div className="h-px bg-white/10" />

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-background/50 p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Extracted resume content
                </h2>

                <p className="mt-1 text-sm text-white/45">
                  Text extracted from the uploaded document.
                </p>
              </div>
            </div>

            {resume.extractedText ? (
              <div className="mt-6 max-h-[175] overflow-y-auto rounded-2xl border border-white/10 bg-black/15 p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/70">
                  {resume.extractedText}
                </pre>
              </div>
            ) : (
              <div className="mt-6 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 p-8">
                <p className="max-w-md text-center text-sm text-white/45">
                  Extracted text is not available for this resume yet.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
              <h2 className="text-lg font-semibold text-white">
                Resume details
              </h2>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/40">Original name</dt>

                  <dd className="max-w-[60%] wrap-break-word text-right text-white/70">
                    {resume.originalName}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-white/40">File type</dt>

                  <dd className="text-white/70">
                    {formatFileType(resume.mimeType)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-white/40">File size</dt>

                  <dd className="text-white/70">
                    {formatFileSize(resume.fileSize)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/40">Uploaded</dt>

                  <dd className="max-w-[60%] text-right text-white/70">
                    {formatDate(resume.createdAt)}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/40">Last updated</dt>

                  <dd className="max-w-[60%] text-right text-white/70">
                    {formatDate(resume.updatedAt)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                Analyse this resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Get structured feedback on content, impact, readability and ATS
                compatibility.
              </p>

              <Button
                type="button"
                className="mt-5 w-full cursor-pointer"
                disabled={resume.status !== "EXTRACTED"}
                onClick={() => {
                  toast.info("Resume analysis is coming next.");
                }}
              >
                <Sparkles className="size-4" />
                Analyse resume
              </Button>

              {resume.status !== "EXTRACTED" && (
                <p className="mt-3 text-xs text-white/40">
                  The resume must finish processing before it can be analysed.
                </p>
              )}
            </section>
          </aside>
        </section>
      </div>
    </DashboardContent>
  );
}
