import { prisma } from "../../lib/prisma";

type CreateCoverLetterData = {
    userId: string;
    resumeId: string;
    jobPostId: string;
    title: string;
    content: string;
    tone: string;
    modelUsed?: string;
    promptTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
}


export const coverLetterRepository = () => {
    async function createCoverLetter(data: CreateCoverLetterData) {
        return prisma.coverLetter.create({
            data,
            select: {
                id: true,
                userId: true,
                resumeId: true,
                title: true,
                content: true,
                tone: true,
                promptTokens: true,
                outputTokens: true,
                totalTokens: true,
                modelUsed: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }


    return { createCoverLetter }
}