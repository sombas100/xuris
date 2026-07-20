import { aiService } from "../ai/ai.service.js";
import { jobRepository } from "./job.repository.js";
import type { CreateJobPostFromTextInput } from "./job.validation.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

const repository = jobRepository();
const ai = aiService();

export const jobService = () => {
  async function createJobPostFromText(
    data: CreateJobPostFromTextInput,
    userId: string,
  ) {
    const extractedJob = await ai.extractJobPostFromText(data.rawText);

    return repository.createJob({
      userId,
      title: extractedJob.title,
      company: extractedJob.company ?? undefined,
      location: extractedJob.location ?? undefined,
      salary: extractedJob.salary ?? undefined,
      description: extractedJob.description,
      requirements: extractedJob.requirements,
      responsibilities: extractedJob.responsibilities,
    });
  }

  async function getCurrentUserJobPosts(userId: string) {
    return repository.retrieveUserJobPosts(userId);
  }

  async function getJobPost(id: string, userId: string) {
    const jobPost = await repository.retrieveJobPost(id, userId);

    if (!jobPost) {
      throw new NotFoundError(
        "Job post not found",
        "JOB_POST_NOT_FOUND",
      );
    }

    return jobPost;
  }

  return {
    createJobPostFromText,
    getCurrentUserJobPosts,
    getJobPost,
  };
};