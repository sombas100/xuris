import DashboardContent from "@/components/dashboard/DashboardContent";
import { ResumeCard } from "../features/resumes/components/ResumeCard";
import { ResumeEmptyState } from "../features/resumes/components/ResumeEmptyState";
import { ResumeUploadForm } from "../features/resumes/components/ResumeUploadForm";
import { useResumes } from "../features/resumes/hooks/use-resumes";

export function ResumesPage() {
  const {
    data: resumes,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useResumes();

  function scrollToUpload() {
    document.getElementById("resume-upload-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <DashboardContent>
      <div className="space-y-8 ">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Resumes
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Upload and manage the resumes you use for analysis, comparisons,
              cover letters, and interview preparation.
            </p>
          </div>

          {resumes && resumes.length > 0 && (
            <p className="text-sm text-white/40">
              {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}
            </p>
          )}
        </section>

        <div id="resume-upload-section">
          <ResumeUploadForm />
        </div>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">Your resumes</h2>

            <p className="mt-1 text-sm text-white/45">
              Select a resume to view its extracted content and available
              actions.
            </p>
          </div>

          {isPending && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/3"
                />
              ))}
            </div>
          )}

          {isError && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-8">
              <h3 className="font-semibold text-destructive">
                We could not load your resumes
              </h3>

              <p className="mt-2 text-sm text-white/50">{error.message}</p>

              <button
                type="button"
                className="mt-4 text-sm font-medium text-primary hover:underline"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          )}

          {!isPending && !isError && resumes?.length === 0 && (
            <ResumeEmptyState onUploadClick={scrollToUpload} />
          )}

          {resumes && resumes.length > 0 && (
            <>
              {isFetching && (
                <p className="mb-4 text-sm text-white/40">
                  Refreshing resumes...
                </p>
              )}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </DashboardContent>
  );
}
