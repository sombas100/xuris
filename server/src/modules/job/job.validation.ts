import { z }  from 'zod';

export const createJobPostSchema = z.object({
    title: z.string().min(1, "Title required").max(150),
    company: z.string().min(1).max(150).optional(),
    location: z.string().optional(),
    salary: z.string().optional(),
    description: z.string().min(50, 'Minimum of 50 characters is required'),
    jobUrl: z.url().optional(),
    requirements: z.array(z.string()).optional(),
    responsibilities: z.array(z.string()).optional(),
})

export type CreateJobPostInput = z.infer<typeof createJobPostSchema>