import { z } from 'zod';

const createInterviewPrepSchema = z.object({
    resumeId: z.cuid2().optional(),
    jobPostId: z.cuid2().optional(),
})

export type CreateInterviewPrepInput = z.infer<typeof createInterviewPrepSchema>;