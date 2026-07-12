type ResumeEmptyStateProps = {
  onUploadClick: () => void;
};

export function ResumeEmptyState({ onUploadClick }: ResumeEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-white">No resumes uploaded</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
        Upload your first resume to begin analysing its content, comparing it
        with job adverts, and preparing tailored applications.
      </p>

      <button
        type="button"
        className="mt-5 text-sm font-medium text-primary hover:underline"
        onClick={onUploadClick}
      >
        Upload your first resume
      </button>
    </div>
  );
}
