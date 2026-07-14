import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useCoverLetters } from "@/features/cover-letters/hooks/use-cover-letters";
import { ResumeSelector } from "@/features/resume-analysis/components/ResumeSelector";
import { useResumes } from "@/features/resumes/hooks/use-resumes";

import { useUpdateApplication } from "../hooks/use-update-application";
import type { JobApplication } from "../application.types";

type ApplicationEditFormProps = {
  application: JobApplication;
  onCancel: () => void;
  onSuccess?: () => void;
};

function toDateTimeLocalValue(date: string | null | undefined) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const offset = parsedDate.getTimezoneOffset();

  const localDate = new Date(parsedDate.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

function toIsoDate(value: string): string | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

export function ApplicationEditForm({
  application,
  onCancel,
  onSuccess,
}: ApplicationEditFormProps) {
  const [resumeId, setResumeId] = useState(application.resumeId ?? "");

  const [coverLetterId, setCoverLetterId] = useState(
    application.coverLetterId ?? "",
  );

  const [company, setCompany] = useState(application.company);

  const [role, setRole] = useState(application.role);

  const [jobUrl, setJobUrl] = useState(application.jobUrl ?? "");

  const [location, setLocation] = useState(application.location ?? "");

  const [salary, setSalary] = useState(application.salary ?? "");

  const [notes, setNotes] = useState(application.notes ?? "");

  const [appliedAt, setAppliedAt] = useState(
    toDateTimeLocalValue(application.appliedAt),
  );

  const [interviewAt, setInterviewAt] = useState(
    toDateTimeLocalValue(application.interviewAt),
  );

  const [followUpDate, setFollowUpDate] = useState(
    toDateTimeLocalValue(application.followUpDate),
  );

  const { data: resumes } = useResumes();

  const {
    data: coverLetters,
    isPending: coverLettersPending,
    isError: coverLettersError,
  } = useCoverLetters(
    resumeId || undefined,
    application.jobPostId || undefined,
  );

  const updateMutation = useUpdateApplication();

  useEffect(() => {
    if (!resumeId) {
      setCoverLetterId("");
      return;
    }

    if (
      coverLetterId &&
      coverLetters &&
      !coverLetters.some((coverLetter) => coverLetter.id === coverLetterId)
    ) {
      setCoverLetterId("");
    }
  }, [coverLetterId, coverLetters, resumeId]);

  function handleSubmit() {
    if (!company.trim()) {
      toast.error("Company is required.");
      return;
    }

    if (!role.trim()) {
      toast.error("Role is required.");
      return;
    }

    updateMutation.mutate(
      {
        applicationId: application.id,

        input: {
          resumeId: resumeId || null,
          coverLetterId: coverLetterId || null,

          company: company.trim(),
          role: role.trim(),

          jobUrl: jobUrl.trim() || null,
          location: location.trim() || null,
          salary: salary.trim() || null,
          notes: notes.trim() || null,

          appliedAt: toIsoDate(appliedAt),
          interviewAt: toIsoDate(interviewAt),

          followUpDate: toIsoDate(followUpDate),
        },
      },
      {
        onSuccess: () => {
          toast.success("Application updated", {
            description: "Your application details have been saved.",
          });

          onSuccess?.();
        },

        onError: (error) => {
          toast.error("Could not update application", {
            description: error.message,
          });
        },
      },
    );
  }

  return (
    <section className="rounded-3xl border mb-2 border-primary/20 bg-primary/4 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Edit application</h2>

        <p className="mt-2 text-sm text-white/50">
          Update the role information, attached documents and important dates.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <InputField
          label="Company"
          value={company}
          disabled={updateMutation.isPending}
          onChange={setCompany}
        />

        <InputField
          label="Role"
          value={role}
          disabled={updateMutation.isPending}
          onChange={setRole}
        />

        <InputField
          label="Job URL"
          value={jobUrl}
          placeholder="https://..."
          disabled={updateMutation.isPending}
          onChange={setJobUrl}
        />

        <InputField
          label="Location"
          value={location}
          placeholder="London"
          disabled={updateMutation.isPending}
          onChange={setLocation}
        />

        <InputField
          label="Salary"
          value={salary}
          placeholder="£45,000–£55,000"
          disabled={updateMutation.isPending}
          onChange={setSalary}
        />
      </div>

      <div className="mt-5">
        <ResumeSelector
          resumes={resumes ?? []}
          value={resumeId}
          disabled={updateMutation.isPending}
          onChange={setResumeId}
        />
      </div>

      {resumeId && application.jobPostId && (
        <div className="mt-5">
          <label
            htmlFor="edit-application-cover-letter"
            className="text-sm font-medium text-white"
          >
            Cover letter
          </label>

          <select
            id="edit-application-cover-letter"
            value={coverLetterId}
            disabled={updateMutation.isPending || coverLettersPending}
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
                No cover letters are available for this resume and job advert.
              </p>
            )}

          {coverLettersError && (
            <p className="mt-2 text-xs text-destructive">
              Cover letters could not be loaded.
            </p>
          )}
        </div>
      )}

      {!application.jobPostId && (
        <p className="mt-5 text-xs text-white/40">
          A cover letter can only be attached when the application is connected
          to a saved job advert.
        </p>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <DateTimeField
          id="edit-application-applied-at"
          label="Applied date"
          value={appliedAt}
          disabled={updateMutation.isPending}
          onChange={setAppliedAt}
        />

        <DateTimeField
          id="edit-application-interview-at"
          label="Interview date"
          value={interviewAt}
          disabled={updateMutation.isPending}
          onChange={setInterviewAt}
        />

        <DateTimeField
          id="edit-application-follow-up"
          label="Follow-up date"
          value={followUpDate}
          disabled={updateMutation.isPending}
          onChange={setFollowUpDate}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="edit-application-notes"
          className="text-sm font-medium text-white"
        >
          Notes
        </label>

        <textarea
          id="edit-application-notes"
          value={notes}
          disabled={updateMutation.isPending}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add useful application notes..."
          className="mt-2 min-h-36 w-full rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          className="cursor-pointer"
          disabled={updateMutation.isPending}
          onClick={handleSubmit}
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>

        <Button
          type="button"
          variant="secondaryAction"
          className="cursor-pointer"
          disabled={updateMutation.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

type DateTimeFieldProps = {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function DateTimeField({
  id,
  label,
  value,
  disabled,
  onChange,
}: DateTimeFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>

      <input
        id={id}
        type="datetime-local"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
