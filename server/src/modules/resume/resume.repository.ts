import { prisma } from "../../lib/prisma";

type CreateResumeData = {
  userId: string;
  title: string;
  originalName: string;
  fileUrl: string;
  fileKey: string;
  mimeType: string;
  fileSize: number;
  status: "UPLOADED";
};

export const resumeRepository = () => {
    async function retrieveResume(id: string) {
        return prisma.resume.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                originalName: true,
                fileUrl: true,
                fileKey: true,
                mimeType: true,
                fileSize: true,
                extractedText: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,

                    }
                }
            }
        })
        
    }  

    async function retreiveAllResumes(userId: string) {
        return prisma.resume.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                originalName: true,
                fileUrl: true,
                fileKey: true,
                mimeType: true,
                fileSize: true,
                extractedText: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
            
        })
    }

    async function createResume(data: CreateResumeData) {
        return prisma.resume.create({
            data,
            select: {
                id: true,
                title: true,
                originalName: true,
                fileUrl: true,
                fileKey: true,
                fileSize: true,
                mimeType: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }

    return { retrieveResume, retreiveAllResumes, createResume }
}