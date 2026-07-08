import { z } from 'zod';

const coverLetterSchema = z.object({
    resumeId: z.string().min(1),
    jobPostId: z.string().min(1)
})

export type CreateCoverLetterInput = z.infer<typeof coverLetterSchema>;