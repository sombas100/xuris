import { prisma } from "../../lib/prisma";

export const resumeRepository = () => {
    async function getResume(id: string) {
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

    return { getResume }
}