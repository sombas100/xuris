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

import { InterviewPrepHistory } from "../components/InterviewPrepHistory";
import { InterviewPrepProcessingModal } from "../components/InterviewPrepProcessingModal";
import { InterviewPrepResults } from "../components/InterviewPrepResults";
import { RunInterviewPrepButton } from "../components/RunInterviewPrepButton";
import { useCreateInterviewPrep } from "../hooks/use-create-interview-preps";
import { useInterviewPreps } from "../hooks/use-interview-preps";
import { useDocumentTitle } from "@/hooks/use-document-title";

export function InterviewPrepPage() {
  useDocumentTitle("Interview Preparation");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedResumeId = searchParams.get("resumeId") ?? "";

  const selectedJobPostId = searchParams.get("jobPostId") ?? "";

  const selectedInterviewPrepId = searchParams.get("interviewPrepId");

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
    data: interviewPreps,
    isPending: sessionsPending,
    isError: sessionsError,
    error: sessionsErrorValue,
  } = useInterviewPreps(selectedResumeId, selectedJobPostId);

  const createMutation = useCreateInterviewPrep();

  const latestSession = interviewPreps?.[0];

  const displayedSession =
    interviewPreps?.find((session) => session.id === selectedInterviewPrepId) ??
    latestSession;

  const displayedJobPost = jobPosts?.find(
    (jobPost) => jobPost.id === displayedSession?.jobPostId,
  );

  useEffect(() => {
    if (
      selectedResumeId &&
      selectedJobPostId &&
      latestSession &&
      !selectedInterviewPrepId
    ) {
      setSearchParams({
        resumeId: selectedResumeId,
        jobPostId: selectedJobPostId,
        interviewPrepId: latestSession.id,
      });
    }
  }, [
    latestSession,
    selectedInterviewPrepId,
    selectedJobPostId,
    selectedResumeId,
    setSearchParams,
  ]);

  function updateSearchParams(values: {
    resumeId?: string;
    jobPostId?: string;
    interviewPrepId?: string;
  }) {
    const nextParams = new URLSearchParams();

    if (values.resumeId) {
      nextParams.set("resumeId", values.resumeId);
    }

    if (values.jobPostId) {
      nextParams.set("jobPostId", values.jobPostId);
    }

    if (values.interviewPrepId) {
      nextParams.set("interviewPrepId", values.interviewPrepId);
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

  function handleSessionSelect(interviewPrepId: string) {
    updateSearchParams({
      resumeId: selectedResumeId,
      jobPostId: selectedJobPostId,
      interviewPrepId,
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
            interviewPrepId: response.data.id,
          });

          toast.success("Interview preparation ready", {
            description: "Your personalised questions and guidance are ready.",
          });
        },

        onError: (error) => {
          toast.error("Interview preparation failed", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <>
      <InterviewPrepProcessingModal open={createMutation.isPending} />

      <DashboardContent>
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Interview preparation
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Generate personalised technical, behavioural and role-specific
              interview questions from your resume and job advert.
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
                    A resume is required before Xuris can prepare your
                    interview.
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

                  <RunInterviewPrepButton
                    hasExistingSession={Boolean(latestSession)}
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

          {selectedResumeId && selectedJobPostId && sessionsPending && (
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
          )}

          {sessionsError && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-destructive">{sessionsErrorValue.message}</p>
            </div>
          )}

          {interviewPreps && interviewPreps.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
              <InterviewPrepHistory
                interviewPreps={interviewPreps}
                selectedInterviewPrepId={displayedSession?.id ?? null}
                disabled={createMutation.isPending}
                onSelect={handleSessionSelect}
              />

              {displayedSession && (
                <InterviewPrepResults
                  interviewPrep={displayedSession}
                  jobPost={displayedJobPost}
                />
              )}
            </div>
          )}

          {selectedResumeId &&
            selectedJobPostId &&
            !sessionsPending &&
            !sessionsError &&
            !latestSession && (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No interview session yet
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Generate a personalised interview session using the selected
                  resume and job advert.
                </p>
              </div>
            )}
        </div>
      </DashboardContent>
    </>
  );
}
