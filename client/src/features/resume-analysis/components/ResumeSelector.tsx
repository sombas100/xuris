import type { Resume } from "@/features/resumes/resume.types";

type ResumeSelectorProps = {
  resumes: Resume[];
  value: string;
  disabled?: boolean;
  onChange: (resumeId: string) => void;
};

export function ResumeSelector({
  resumes,
  value,
  disabled,
  onChange,
}: ResumeSelectorProps) {
  return (
    <div>
      <label
        htmlFor="analysis-resume"
        className="text-sm font-medium text-white"
      >
        Resume
      </label>

      <select
        id="analysis-resume"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none transition-colors focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option className="pr-2" value="">
          Select a resume
        </option>

        {resumes.map((resume) => (
          <option key={resume.id} value={resume.id}>
            {resume.title}
          </option>
        ))}
      </select>
    </div>
  );
}
