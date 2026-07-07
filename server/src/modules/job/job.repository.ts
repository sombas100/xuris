import { prisma } from "../../lib/prisma";

type CreateJobData = {
    userId: string
    title: string;
    company?: string
    location?: string;
    salary?: string;
    description: string;
    jobUrl?: string;
    requirements?: string[];
    responsibilities?: string[];
}

export const jobRepository = () => {
    async function createJob(data: CreateJobData) {
        return prisma.jobPost.create({
            data,
            select: {
                id: true,
                title: true,
                company: true,
                location: true,
                salary: true,
                description: true,
                jobUrl: true,
                createdAt: true,
                updatedAt: true,
                requirements: true,
                responsibilities: true,
            }
        })
    }


    return { createJob }
}