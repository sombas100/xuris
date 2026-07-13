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

import { JobComparisonHistory } from "../components/JobComparisonHistory";
import { JobComparisonProcessingModal } from "../components/JobComparisonProcessingModal";
import { JobComparisonResults } from "../components/JobComparisonResults";
import { RunJobComparisonButton } from "../components/RunJobComparisonButton";
import { useCreateJobComparison } from "../hooks/use-create-job-comparison";
import { useJobComparisons } from "../hooks/use-job-comparisons";

export function JobComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedResumeId = searchParams.get("resumeId") ?? "";

  const selectedJobPostId = searchParams.get("jobPostId") ?? "";

  const selectedComparisonId = searchParams.get("comparisonId");

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
    data: comparisons,
    isPending: comparisonsPending,
    isError: comparisonsError,
    error: comparisonsErrorValue,
  } = useJobComparisons(selectedResumeId);

  const comparisonMutation = useCreateJobComparison();

  const latestComparison = comparisons?.[0];

  const displayedComparison =
    comparisons?.find((comparison) => comparison.id === selectedComparisonId) ??
    latestComparison;

  const displayedJobPost = jobPosts?.find(
    (jobPost) => jobPost.id === displayedComparison?.jobPostId,
  );

  const existingComparisonForSelection =
    comparisons?.some(
      (comparison) => comparison.jobPostId === selectedJobPostId,
    ) ?? false;

  useEffect(() => {
    if (selectedResumeId && latestComparison && !selectedComparisonId) {
      setSearchParams({
        resumeId: selectedResumeId,
        jobPostId: selectedJobPostId || latestComparison.jobPostId,
        comparisonId: latestComparison.id,
      });
    }
  }, [
    latestComparison,
    selectedComparisonId,
    selectedJobPostId,
    selectedResumeId,
    setSearchParams,
  ]);

  function updateSearchParams(values: {
    resumeId?: string;
    jobPostId?: string;
    comparisonId?: string;
  }) {
    const nextParams = new URLSearchParams();

    if (values.resumeId) {
      nextParams.set("resumeId", values.resumeId);
    }

    if (values.jobPostId) {
      nextParams.set("jobPostId", values.jobPostId);
    }

    if (values.comparisonId) {
      nextParams.set("comparisonId", values.comparisonId);
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

  function handleComparisonSelect(comparisonId: string) {
    const comparison = comparisons?.find((item) => item.id === comparisonId);

    if (!comparison) {
      return;
    }

    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId: comparison.jobPostId,
      comparisonId,
    });
  }

  function handleJobPostCreated(jobPost: JobPost) {
    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId: jobPost.id,
    });

    setShowJobPostForm(false);
  }

  function handleCompare() {
    if (!selectedResumeId) {
      toast.error("Select a resume first.");
      return;
    }

    if (!selectedJobPostId) {
      toast.error("Select a job advert first.");
      return;
    }

    comparisonMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobPostId: selectedJobPostId,
      },
      {
        onSuccess: (response) => {
          updateSearchParams({
            resumeId: selectedResumeId,
            jobPostId: selectedJobPostId,
            comparisonId: response.data.id,
          });

          toast.success("Job comparison complete", {
            description: "Your resume match results are ready.",
          });
        },

        onError: (error) => {
          toast.error("Comparison failed", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <>
      <JobComparisonProcessingModal open={comparisonMutation.isPending} />

      <DashboardContent>
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Job comparison
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Compare your resume against a job advert to identify matching
              strengths, missing requirements, keywords and recommended changes.
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
                    You need a resume before Xuris can run a job comparison.
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
                    disabled={comparisonMutation.isPending}
                    onChange={handleResumeChange}
                  />

                  <JobPostSelector
                    jobPosts={jobPosts ?? []}
                    value={selectedJobPostId}
                    disabled={comparisonMutation.isPending}
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

                  <RunJobComparisonButton
                    hasExistingComparison={existingComparisonForSelection}
                    disabled={!selectedResumeId || !selectedJobPostId}
                    pending={comparisonMutation.isPending}
                    onConfirm={handleCompare}
                  />
                </div>

                {showResumeUpload && <ResumeUploadForm />}

                {showJobPostForm && (
                  <JobPostFromTextForm onCreated={handleJobPostCreated} />
                )}
              </div>
            )}
          </section>

          {selectedResumeId && comparisonsPending && (
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
          )}

          {comparisonsError && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-destructive">
                {comparisonsErrorValue.message}
              </p>
            </div>
          )}

          {selectedResumeId && comparisons && comparisons.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
              <JobComparisonHistory
                comparisons={comparisons}
                jobPosts={jobPosts ?? []}
                selectedComparisonId={displayedComparison?.id ?? null}
                disabled={comparisonMutation.isPending}
                onSelect={handleComparisonSelect}
              />

              {displayedComparison && (
                <JobComparisonResults
                  comparison={displayedComparison}
                  jobPost={displayedJobPost}
                />
              )}
            </div>
          )}

          {selectedResumeId &&
            !comparisonsPending &&
            !comparisonsError &&
            !latestComparison && (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No comparisons yet
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Select a job advert and compare it with your resume to receive
                  personalised match feedback.
                </p>
              </div>
            )}
        </div>
      </DashboardContent>
    </>
  );
}
