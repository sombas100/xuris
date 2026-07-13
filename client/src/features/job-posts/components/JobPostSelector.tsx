import type { JobPost } from "../job-post.types";

type JobPostSelectorProps = {
  jobPosts: JobPost[];
  value: string;
  disabled?: boolean;
  onChange: (jobPostId: string) => void;
};

export function JobPostSelector({
  jobPosts,
  value,
  disabled,
  onChange,
}: JobPostSelectorProps) {
  return (
    <div>
      <label
        htmlFor="job-post-selector"
        className="text-sm font-medium text-white"
      >
        Job advert
      </label>

      <select
        id="job-post-selector"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-background px-3 text-sm text-white outline-none transition-colors focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Select a job advert</option>

        {jobPosts.map((jobPost) => (
          <option key={jobPost.id} value={jobPost.id}>
            {jobPost.title}
            {jobPost.company ? ` — ${jobPost.company}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
