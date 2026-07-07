import { jobRepository } from "./job.repository";
import { HttpError } from "../../errors/HttpError";
import type { CreateJobPostInput } from "./job.validation";

const jobRepo = jobRepository();

export const jobService = () => {
    async function createJobPost(data: CreateJobPostInput, userId: string) {
        return jobRepo.createJob({
            userId,
            title: data.title,
            company: data.company,
            location: data.location,
            salary: data.salary,
            description: data.description,
            jobUrl: data.jobUrl,
            requirements: data.requirements,
            responsibilities: data.responsibilities,
        })
    }

    return { createJobPost }
}