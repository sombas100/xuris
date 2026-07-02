import { z } from 'zod';

export const resumeAnalysisSchema = z.object({
    atsScore: z.number().min(0).max(100),
    summary: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    improvements: z.array(z.string()),
})