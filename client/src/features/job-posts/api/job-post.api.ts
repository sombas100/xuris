import type { ApiRequest } from "@/lib/api-client";

import type {
  CreateJobPostFromTextInput,
  JobPostListResponse,
  JobPostResponse,
} from "../job-post.types";

const JOB_POST_ENDPOINT = "/jobs/v1";

export function getJobPosts(
  request: ApiRequest,
  signal?: AbortSignal,
) {
  return request<JobPostListResponse>(
    JOB_POST_ENDPOINT,
    { signal },
  );
}

export function createJobPostFromText(
  request: ApiRequest,
  input: CreateJobPostFromTextInput,
) {
  return request<JobPostResponse>(
    `${JOB_POST_ENDPOINT}/from-text`,
    {
      method: "POST",
      body: input,
    },
  );
}