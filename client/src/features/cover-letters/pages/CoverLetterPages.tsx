import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardContent from "@/components/dashboard/DashboardContent";

import { JobPostFromTextForm } from "@/features/job-posts/components/JobPostFromTextForm";
import { JobPostSelector } from "@/features/job-posts/components/JobPostSelector";
import { useJobPosts } from "@/features/job-posts/hooks/use-job-posts";
import type { JobPost } from "@/features/job-posts/job-post.types";

import { ResumeSelector } from "@/features/resume-analysis/components/ResumeSelector";
import { ResumeUploadForm } from "@/features/resumes/components/ResumeUploadForm";
import { useResumes } from "@/features/resumes/hooks/use-resumes";

import { CoverLetterHistory } from "../components/CoverLetterHistory";
import { CoverLetterProcessingModal } from "../components/CoverLetterProcessingModal";
import { CoverLetterResult } from "../components/CoverLetterResult";
import { RunCoverLetterButton } from "../components/RunCoverLetterButton";
import { useCoverLetters } from "../hooks/use-cover-letters";
import { useCreateCoverLetter } from "../hooks/use-create-cover-letter";

export function CoverLettersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedResumeId = searchParams.get("resumeId") ?? "";

  const selectedJobPostId = searchParams.get("jobPostId") ?? "";

  const selectedCoverLetterId = searchParams.get("coverLetterId");

  const [showResumeUpload, setShowResumeUpload] = useState(false);

  const [showJobPostForm, setShowJobPostForm] = useState(false);

  const {
    data: resumes,
    isPending: resumesPending,
    isError: resumesError,
    error: resumesErrorValue,
  } = useResumes();

  const {
    data: jobPosts,
    isPending: jobPostsPending,
    isError: jobPostsError,
    error: jobPostsErrorValue,
  } = useJobPosts();

  const {
    data: coverLetters,
    isPending: coverLettersPending,
    isError: coverLettersError,
    error: coverLettersErrorValue,
  } = useCoverLetters(selectedResumeId, selectedJobPostId);

  const createMutation = useCreateCoverLetter();

  const latestCoverLetter = coverLetters?.[0];

  const displayedCoverLetter =
    coverLetters?.find(
      (coverLetter) => coverLetter.id === selectedCoverLetterId,
    ) ?? latestCoverLetter;

  const displayedJobPost = jobPosts?.find(
    (jobPost) => jobPost.id === displayedCoverLetter?.jobPostId,
  );

  useEffect(() => {
    if (
      selectedResumeId &&
      selectedJobPostId &&
      latestCoverLetter &&
      !selectedCoverLetterId
    ) {
      setSearchParams({
        resumeId: selectedResumeId,
        jobPostId: selectedJobPostId,
        coverLetterId: latestCoverLetter.id,
      });
    }
  }, [
    latestCoverLetter,
    selectedCoverLetterId,
    selectedJobPostId,
    selectedResumeId,
    setSearchParams,
  ]);

  function updateSearchParams(values: {
    resumeId?: string;
    jobPostId?: string;
    coverLetterId?: string;
  }) {
    const nextParams = new URLSearchParams();

    if (values.resumeId) {
      nextParams.set("resumeId", values.resumeId);
    }

    if (values.jobPostId) {
      nextParams.set("jobPostId", values.jobPostId);
    }

    if (values.coverLetterId) {
      nextParams.set("coverLetterId", values.coverLetterId);
    }

    setSearchParams(nextParams);
  }

  function handleResumeChange(resumeId: string) {
    updateSearchParams({
      resumeId,
      jobPostId: selectedJobPostId,
    });
  }

  function handleJobPostChange(jobPostId: string) {
    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId,
    });
  }

  function handleCoverLetterSelect(coverLetterId: string) {
    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId: selectedJobPostId,
      coverLetterId,
    });
  }

  function handleJobPostCreated(jobPost: JobPost) {
    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId: jobPost.id,
    });

    setShowJobPostForm(false);
  }

  function handleGenerate() {
    if (!selectedResumeId) {
      toast.error("Select a resume first.");
      return;
    }

    if (!selectedJobPostId) {
      toast.error("Select a job advert first.");
      return;
    }

    createMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobPostId: selectedJobPostId,
      },
      {
        onSuccess: (response) => {
          updateSearchParams({
            resumeId: selectedResumeId,
            jobPostId: selectedJobPostId,
            coverLetterId: response.data.id,
          });

          toast.success("Cover letter ready", {
            description: "Your tailored cover letter has been generated.",
          });
        },

        onError: (error) => {
          toast.error("Cover letter generation failed", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <>
      <CoverLetterProcessingModal open={createMutation.isPending} />

      <DashboardContent>
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Cover letters
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Generate a tailored cover letter using your resume and a saved job
              advert.
            </p>
          </header>

          <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
            {(resumesPending || jobPostsPending) && (
              <p className="text-sm text-white/50">
                Loading your resumes and job adverts...
              </p>
            )}

            {resumesError && (
              <p className="text-sm text-destructive">
                {resumesErrorValue.message}
              </p>
            )}

            {jobPostsError && (
              <p className="text-sm text-destructive">
                {jobPostsErrorValue.message}
              </p>
            )}

            {resumes && resumes.length === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-semibold text-white">
                    Upload a resume first
                  </h2>

                  <p className="mt-2 text-sm text-white/50">
                    A resume is required before Xuris can create a cover letter.
                  </p>
                </div>

                <ResumeUploadForm />
              </div>
            )}

            {resumes && resumes.length > 0 && (
              <div className="space-y-6">
                <div className="grid gap-5 lg:grid-cols-2">
                  <ResumeSelector
                    resumes={resumes}
                    value={selectedResumeId}
                    disabled={createMutation.isPending}
                    onChange={handleResumeChange}
                  />

                  <JobPostSelector
                    jobPosts={jobPosts ?? []}
                    value={selectedJobPostId}
                    disabled={createMutation.isPending}
                    onChange={handleJobPostChange}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => setShowResumeUpload((current) => !current)}
                    >
                      {showResumeUpload
                        ? "Hide resume upload"
                        : "Upload another resume"}
                    </button>

                    <button
                      type="button"
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={() => setShowJobPostForm((current) => !current)}
                    >
                      {showJobPostForm
                        ? "Hide job advert form"
                        : "Paste a new job advert"}
                    </button>
                  </div>

                  <RunCoverLetterButton
                    hasExistingLetter={Boolean(latestCoverLetter)}
                    disabled={!selectedResumeId || !selectedJobPostId}
                    pending={createMutation.isPending}
                    onConfirm={handleGenerate}
                  />
                </div>

                {showResumeUpload && <ResumeUploadForm />}

                {showJobPostForm && (
                  <JobPostFromTextForm onCreated={handleJobPostCreated} />
                )}
              </div>
            )}
          </section>

          {selectedResumeId && selectedJobPostId && coverLettersPending && (
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
          )}

          {coverLettersError && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-destructive">
                {coverLettersErrorValue.message}
              </p>
            </div>
          )}

          {coverLetters && coverLetters.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
              <CoverLetterHistory
                coverLetters={coverLetters}
                selectedCoverLetterId={displayedCoverLetter?.id ?? null}
                disabled={createMutation.isPending}
                onSelect={handleCoverLetterSelect}
              />

              {displayedCoverLetter && (
                <CoverLetterResult
                  coverLetter={displayedCoverLetter}
                  jobPost={displayedJobPost}
                />
              )}
            </div>
          )}

          {selectedResumeId &&
            selectedJobPostId &&
            !coverLettersPending &&
            !coverLettersError &&
            !latestCoverLetter && (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No cover letter yet
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Generate a tailored cover letter using the selected resume and
                  job advert.
                </p>
              </div>
            )}
        </div>
      </DashboardContent>
    </>
  );
}
