import { prisma } from "../../lib/prisma";
import { InterviewDifficulty } from "../../../generated/prisma/enums";
import type { InterviewQuestion } from "../ai/ai.types";

type CreateInterviewPrepData = {
  userId: string;
  resumeId: string;
  jobPostId: string;
  difficulty: InterviewDifficulty;
  summary: string;
  technicalQuestions: InterviewQuestion[];
  behaviouralQuestions: InterviewQuestion[];
  roleSpecificQuestions: InterviewQuestion[];
  weaknessAreas: string[];
  questionsToAsk: string[];
  tips: string[];
  modelUsed?: string;
  promptTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export const interviewPrepRepository = () => {
  async function createInterviewPrep(data: CreateInterviewPrepData) {
    return prisma.interviewPrep.create({
      data,

      select: {
        id: true,
        userId: true,
        resumeId: true,
        jobPostId: true,
        difficulty: true,
        summary: true,
        technicalQuestions: true,
        behaviouralQuestions: true,
        roleSpecificQuestions: true,
        weaknessAreas: true,
        questionsToAsk: true,
        tips: true,
        modelUsed: true,
        promptTokens: true,
        outputTokens: true,
        totalTokens: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async function getInterviewPrepById(
    id: string,
    userId: string,
  ) {
    return prisma.interviewPrep.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async function getInterviewPrepsByResumeId(
    resumeId: string,
    userId: string,
  ) {
    return prisma.interviewPrep.findMany({
      where: {
        resumeId,
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async function getInterviewPrepsByResumeAndJob(
    resumeId: string,
    jobPostId: string,
    userId: string,
  ) {
    return prisma.interviewPrep.findMany({
      where: {
        resumeId,
        jobPostId,
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return {
    createInterviewPrep,
    getInterviewPrepById,
    getInterviewPrepsByResumeId,
    getInterviewPrepsByResumeAndJob,
  };
};