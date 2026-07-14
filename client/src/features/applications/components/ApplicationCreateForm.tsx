import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCoverLetters } from "@/features/cover-letters/hooks/use-cover-letters";
import { JobPostSelector } from "@/features/job-posts/components/JobPostSelector";
import { useJobPosts } from "@/features/job-posts/hooks/use-job-posts";
import { ResumeSelector } from "@/features/resume-analysis/components/ResumeSelector";
import { useResumes } from "@/features/resumes/hooks/use-resumes";

import { useCreateApplication } from "../hooks/use-create-application";
import type { ApplicationStatus } from "../application.types";

type ApplicationCreateFormProps = {
  onSuccess?: () => void;
};

const statuses: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  {
    value: "TECHNICAL_TEST",
    label: "Technical test",
  },
  {
    value: "FINAL_INTERVIEW",
    label: "Final interview",
  },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export function ApplicationCreateForm({
  onSuccess,
}: ApplicationCreateFormProps) {
  const [resumeId, setResumeId] = useState("");
  const [jobPostId, setJobPostId] = useState("");
  const [coverLetterId, setCoverLetterId] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<ApplicationStatus>("SAVED");

  const [followUpDate, setFollowUpDate] = useState("");

  const { data: resumes } = useResumes();
  const { data: jobPosts } = useJobPosts();

  const {
    data: coverLetters,
    isPending: coverLettersPending,
    isError: coverLettersError,
  } = useCoverLetters(resumeId || undefined, jobPostId || undefined);

  const createMutation = useCreateApplication();

  useEffect(() => {
    setCoverLetterId("");
  }, [resumeId, jobPostId]);

  function resetForm() {
    setResumeId("");
    setJobPostId("");
    setCoverLetterId("");
    setCompany("");
    setRole("");
    setJobUrl("");
    setLocation("");
    setSalary("");
    setNotes("");
    setStatus("SAVED");
    setFollowUpDate("");
  }

  function handleSubmit() {
    if (!jobPostId && (!company.trim() || !role.trim())) {
      toast.error("Select a saved job advert or enter a company and role.");

      return;
    }

    createMutation.mutate(
      {
        resumeId: resumeId || undefined,
        jobPostId: jobPostId || undefined,
        coverLetterId: coverLetterId || undefined,

        company: jobPostId || !company.trim() ? undefined : company.trim(),

        role: jobPostId || !role.trim() ? undefined : role.trim(),

        jobUrl: jobUrl.trim() || null,
        location: location.trim() || null,
        salary: salary.trim() || null,
        notes: notes.trim() || null,

        status,

        followUpDate: followUpDate
          ? new Date(followUpDate).toISOString()
          : null,
      },
      {
        onSuccess: () => {
          toast.success("Application created", {
            description: "The application has been added to your tracker.",
          });

          resetForm();
          onSuccess?.();
        },

        onError: (error) => {
          toast.error("Could not create application", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-background/50 p-6">
      <h2 className="text-xl font-semibold text-white">Add application</h2>

      <p className="mt-2 text-sm text-white/50">
        Use a saved job advert or enter the role manually.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ResumeSelector
          resumes={resumes ?? []}
          value={resumeId}
          disabled={createMutation.isPending}
          onChange={setResumeId}
        />

        <JobPostSelector
          jobPosts={jobPosts ?? []}
          value={jobPostId}
          disabled={createMutation.isPending}
          onChange={setJobPostId}
        />
      </div>

      {resumeId && jobPostId && (
        <div className="mt-5">
          <label
            htmlFor="application-cover-letter"
            className="text-sm font-medium text-white"
          >
            Cover letter
          </label>

          <select
            id="application-cover-letter"
            value={coverLetterId}
            disabled={createMutation.isPending || coverLettersPending}
            onChange={(event) => setCoverLetterId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none transition-colors focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {coverLettersPending
                ? "Loading cover letters..."
                : "No cover letter selected"}
            </option>

            {coverLetters?.map((coverLetter) => (
              <option key={coverLetter.id} value={coverLetter.id}>
                {coverLetter.title}
                {coverLetter.tone ? ` — ${coverLetter.tone}` : ""}
              </option>
            ))}
          </select>

          {!coverLettersPending &&
            !coverLettersError &&
            coverLetters?.length === 0 && (
              <p className="mt-2 text-xs text-white/40">
                No cover letters have been generated for this resume and job
                advert.
              </p>
            )}

          {coverLettersError && (
            <p className="mt-2 text-xs text-destructive">
              Cover letters could not be loaded.
            </p>
          )}
        </div>
      )}

      {!jobPostId && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <InputField
            label="Company"
            value={company}
            onChange={setCompany}
            placeholder="Example Ltd"
          />

          <InputField
            label="Role"
            value={role}
            onChange={setRole}
            placeholder="Frontend Engineer"
          />

          <InputField
            label="Job URL"
            value={jobUrl}
            onChange={setJobUrl}
            placeholder="https://..."
          />

          <InputField
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="London"
          />

          <InputField
            label="Salary"
            value={salary}
            onChange={setSalary}
            placeholder="£45,000–£55,000"
          />
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <label
            htmlFor="application-status"
            className="text-sm font-medium text-white"
          >
            Status
          </label>

          <select
            id="application-status"
            value={status}
            disabled={createMutation.isPending}
            onChange={(event) =>
              setStatus(event.target.value as ApplicationStatus)
            }
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="application-follow-up"
            className="text-sm font-medium text-white"
          >
            Follow-up date
          </label>

          <div className="relative mt-2">
            <input
              id="application-follow-up"
              type="datetime-local"
              value={followUpDate}
              disabled={createMutation.isPending}
              onChange={(event) => setFollowUpDate(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/10 bg-background pl-3 pr-4 text-sm text-white outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark] [&-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="application-notes"
          className="text-sm font-medium text-white"
        >
          Notes
        </label>

        <textarea
          id="application-notes"
          value={notes}
          disabled={createMutation.isPending}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add useful application notes..."
          className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button
        type="button"
        className="mt-6 cursor-pointer"
        disabled={createMutation.isPending}
        onClick={handleSubmit}
      >
        {createMutation.isPending ? "Creating..." : "Add application"}
      </Button>
    </section>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function InputField({ label, value, placeholder, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50"
      />
    </div>
  );
}
