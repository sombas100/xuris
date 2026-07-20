import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  mutationState: {
    isPending: false,
    isError: false,
    error: null as Error | null,
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock("@/components/shared/ProcessingModal", () => ({
  ProcessingModal: ({ open, title }: { open: boolean; title: string }) =>
    open ? <div>{title}</div> : null,
}));

vi.mock("@/features/resumes/hooks/use-upload-resume", () => ({
  useUploadResume: () => ({
    mutate: mocks.mutate,
    reset: mocks.reset,
    isPending: mocks.mutationState.isPending,
    isError: mocks.mutationState.isError,
    error: mocks.mutationState.error,
  }),
}));

import { ResumeUploadForm } from "@/features/resumes/components/ResumeUploadForm";

describe("ResumeUploadForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mutationState.isPending = false;
    mocks.mutationState.isError = false;
    mocks.mutationState.error = null;
  });

  it("rejects unsupported file types", () => {
    render(<ResumeUploadForm />);

    const input = document.querySelector("#resume-upload") as HTMLInputElement;

    const invalidFile = new File(["invalid file"], "resume.txt", {
      type: "text/plain",
    });

    fireEvent.change(input, {
      target: {
        files: [invalidFile],
      },
    });

    expect(
      screen.getByText("Please select a PDF or DOCX file."),
    ).toBeInTheDocument();

    expect(screen.getByText("No resume selected")).toBeInTheDocument();

    expect(mocks.reset).toHaveBeenCalledOnce();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it("uploads a selected PDF and shows a success toast", async () => {
    const user = userEvent.setup();

    mocks.mutate.mockImplementation(
      (
        file: File,
        options: {
          onSuccess: (response: {
            data: {
              originalName: string;
            };
          }) => void;
        },
      ) => {
        options.onSuccess({
          data: {
            originalName: file.name,
          },
        });
      },
    );

    render(<ResumeUploadForm />);

    const input = document.querySelector("#resume-upload") as HTMLInputElement;

    const pdfFile = new File(["resume content"], "corey-resume.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, pdfFile);

    expect(screen.getByText("corey-resume.pdf")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Upload resume",
      }),
    );

    expect(mocks.mutate).toHaveBeenCalledOnce();

    expect(mocks.mutate).toHaveBeenCalledWith(
      pdfFile,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "Resume uploaded successfully",
      {
        description: "corey-resume.pdf is ready to use.",
      },
    );

    expect(screen.getByText("No resume selected")).toBeInTheDocument();
  });

  it("shows the processing state while an upload is pending", () => {
    mocks.mutationState.isPending = true;

    render(<ResumeUploadForm />);

    expect(screen.getByText("Processing your resume")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Uploading...",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Choose file",
      }),
    ).toBeDisabled();
  });

  it("shows an error toast when uploading fails", async () => {
    const user = userEvent.setup();

    const uploadError = new Error("Upload service unavailable");

    mocks.mutate.mockImplementation(
      (
        _file: File,
        options: {
          onError: (error: Error) => void;
        },
      ) => {
        options.onError(uploadError);
      },
    );

    render(<ResumeUploadForm />);

    const input = document.querySelector("#resume-upload") as HTMLInputElement;

    const pdfFile = new File(["resume content"], "corey-resume.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, pdfFile);

    await user.click(
      screen.getByRole("button", {
        name: "Upload resume",
      }),
    );

    expect(mocks.toastError).toHaveBeenCalledWith("Resume upload failed", {
      description: "Upload service unavailable",
    });
  });
});
