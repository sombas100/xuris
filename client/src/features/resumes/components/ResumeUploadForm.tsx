import { useRef, useState, type ChangeEvent } from "react";
import { ProcessingModal } from "@/components/shared/ProcessingModal";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUploadResume } from "../hooks/use-upload-resume";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ResumeUploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const uploadMutation = useUploadResume();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setValidationError(null);
    uploadMutation.reset();

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setSelectedFile(null);
      setValidationError("Please select a PDF or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setValidationError("Your resume must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function handleUpload() {
    if (!selectedFile) {
      setValidationError("Please select a resume first.");
      return;
    }

    uploadMutation.mutate(selectedFile, {
      onSuccess: (response) => {
        setSelectedFile(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }

        toast.success("Resume uploaded successfully", {
          description: `${response.data.originalName} is ready to use.`,
        });
      },

      onError: (error) => {
        toast.error("Resume upload failed", {
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <ProcessingModal
        open={uploadMutation.isPending}
        title="Processing your resume"
        description="Xuris is securely uploading your file and extracting its content."
      />

      <section className="rounded-3xl border border-white/10 bg-background/70 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Upload a resume</h2>

          <p className="mt-2 text-sm text-white/60">
            Upload a PDF or DOCX resume. Xuris will extract its content and make
            it available for analysis.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-6">
          <input
            ref={inputRef}
            id="resume-upload"
            className="sr-only"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={uploadMutation.isPending}
            onChange={handleFileChange}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {selectedFile ? selectedFile.name : "No resume selected"}
              </p>

              <p className="mt-1 text-xs text-white/40">
                PDF or DOCX, maximum 5 MB
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className={"bg-primary hover:bg-secondary transition-colors"}
              disabled={uploadMutation.isPending}
              onClick={() => inputRef.current?.click()}
            >
              Choose file
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <Button
            type="button"
            disabled={!selectedFile || uploadMutation.isPending}
            onClick={handleUpload}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload resume"}
          </Button>

          {selectedFile && (
            <Button
              type="button"
              variant="ghost"
              className={
                "cursor-pointer bg-gray-300 transition-colors hover:bg-gray-500"
              }
              disabled={uploadMutation.isPending}
              onClick={() => {
                setSelectedFile(null);
                setValidationError(null);
                uploadMutation.reset();

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {validationError && (
          <p className="mt-4 text-sm text-destructive">{validationError}</p>
        )}

        {uploadMutation.isError && (
          <p className="mt-4 text-sm text-destructive">{validationError}</p>
        )}
      </section>
    </>
  );
}
