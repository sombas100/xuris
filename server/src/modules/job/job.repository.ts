import { prisma } from "../../lib/prisma";

type CreateJobData = {
  userId: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  description: string;
  jobUrl?: string;
  requirements?: string[];
  responsibilities?: string[];
};

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
      },
    });
  }

  async function retrieveJobPost(id: string, userId: string) {
    return prisma.jobPost.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async function retrieveUserJobPosts(userId: string) {
    return prisma.jobPost.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        salary: true,
        description: true,
        jobUrl: true,
        requirements: true,
        responsibilities: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  return {
    createJob,
    retrieveJobPost,
    retrieveUserJobPosts,
  };
};