import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { ResumeUploadForm } from "@/features/resumes/components/ResumeUploadForm";
import { useResumes } from "@/features/resumes/hooks/use-resumes";

import { AnalysisHistory } from "../components/AnalysisHistory";
import { AnalysisProcessingModal } from "../components/AnalysisProcessingModal";
import { ResumeAnalysisResults } from "../components/ResumeAnalysisResults";
import { ResumeSelector } from "../components/ResumeSelector";
import { RunAnalysisButton } from "../components/RunAnalysisButton";
import { useCreateResumeAnalysis } from "../hooks/use-create-resume-analysis";
import { useResumeAnalyses } from "../hooks/use-resume-analysis";
import { useDocumentTitle } from "@/hooks/use-document-title";

export function ResumeAnalysisPage() {
  useDocumentTitle("Resume Analysis");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedResumeId = searchParams.get("resumeId") ?? "";

  const selectedAnalysisId = searchParams.get("analysisId");

  const [showUploadForm, setShowUploadForm] = useState(false);

  const {
    data: resumes,
    isPending: resumesPending,
    isError: resumesError,
    error: resumesErrorValue,
  } = useResumes();

  const {
    data: analyses,
    isPending: analysesPending,
    isError: analysesError,
    error: analysesErrorValue,
  } = useResumeAnalyses(selectedResumeId);

  const analysisMutation = useCreateResumeAnalysis();

  const latestAnalysis = analyses?.[0];

  const displayedAnalysis =
    analyses?.find((analysis) => analysis.id === selectedAnalysisId) ??
    latestAnalysis;

  useEffect(() => {
    if (selectedResumeId && latestAnalysis && !selectedAnalysisId) {
      setSearchParams({
        resumeId: selectedResumeId,
        analysisId: latestAnalysis.id,
      });
    }
  }, [latestAnalysis, selectedAnalysisId, selectedResumeId, setSearchParams]);

  function handleResumeChange(resumeId: string) {
    if (!resumeId) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      resumeId,
    });
  }

  function handleAnalysisSelect(analysisId: string) {
    if (!selectedResumeId) {
      return;
    }

    setSearchParams({
      resumeId: selectedResumeId,
      analysisId,
    });
  }

  function handleAnalyse() {
    if (!selectedResumeId) {
      toast.error("Select a resume first.");
      return;
    }

    analysisMutation.mutate(selectedResumeId, {
      onSuccess: (response) => {
        setSearchParams({
          resumeId: selectedResumeId,
          analysisId: response.data.id,
        });

        toast.success("Resume analysis complete", {
          description: "Your new analysis is ready to review.",
        });
      },

      onError: (error) => {
        toast.error("Analysis failed", {
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <AnalysisProcessingModal open={analysisMutation.isPending} />

      <DashboardContent>
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Resume analysis
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Review your resume’s content, clarity, skills, formatting and ATS
              compatibility.
            </p>
          </header>

          <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
            {resumesPending && (
              <p className="text-sm text-white/50">Loading your resumes...</p>
            )}

            {resumesError && (
              <p className="text-sm text-destructive">
                {resumesErrorValue.message}
              </p>
            )}

            {resumes && resumes.length === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-semibold text-white">
                    Upload a resume first
                  </h2>

                  <p className="mt-2 text-sm text-white/50">
                    A resume is required before Xuris can generate an analysis.
                  </p>
                </div>

                <ResumeUploadForm />
              </div>
            )}

            {resumes && resumes.length > 0 && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <ResumeSelector
                    resumes={resumes}
                    value={selectedResumeId}
                    disabled={analysisMutation.isPending}
                    onChange={handleResumeChange}
                  />

                  <RunAnalysisButton
                    hasExistingAnalysis={Boolean(latestAnalysis)}
                    disabled={!selectedResumeId}
                    pending={analysisMutation.isPending}
                    onConfirm={handleAnalyse}
                  />
                </div>

                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={() => setShowUploadForm((current) => !current)}
                >
                  {showUploadForm
                    ? "Hide resume upload"
                    : "Upload another resume"}
                </button>

                {showUploadForm && <ResumeUploadForm />}
              </div>
            )}
          </section>

          {selectedResumeId && analysesPending && (
            <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-background/50" />
          )}

          {analysesError && (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
              <p className="text-destructive">{analysesErrorValue.message}</p>
            </div>
          )}

          {selectedResumeId && analyses && analyses.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
              <AnalysisHistory
                analyses={analyses}
                selectedAnalysisId={displayedAnalysis?.id ?? null}
                disabled={analysisMutation.isPending}
                onSelect={handleAnalysisSelect}
              />

              {displayedAnalysis && (
                <ResumeAnalysisResults analysis={displayedAnalysis} />
              )}
            </div>
          )}

          {selectedResumeId &&
            !analysesPending &&
            !analysesError &&
            !latestAnalysis && (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No analysis yet
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  Run an analysis to receive structured feedback and
                  recommendations.
                </p>
              </div>
            )}
        </div>
      </DashboardContent>
    </>
  );
}
