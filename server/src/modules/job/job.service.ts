import { aiService } from "../ai/ai.service";
import { jobRepository } from "./job.repository";
import type {
  CreateJobPostInput,
  CreateJobPostFromTextInput,
} from "./job.validation";

const repository = jobRepository();
const ai = aiService();

export const jobService = () => {
  async function createJobPost(data: CreateJobPostInput, userId: string) {
    return repository.createJob({
      userId,
      title: data.title,
      company: data.company,
      location: data.location,
      salary: data.salary,
      description: data.description,
      jobUrl: data.jobUrl,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
    });
  }

  async function createJobPostFromText(
    data: CreateJobPostFromTextInput,
    userId: string
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

  return {
    createJobPost,
    createJobPostFromText,
  };
};