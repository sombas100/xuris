import { z } from "zod";

export const coverLetterSchema = z.object({
  resumeId: z.cuid2("A valid resume ID is required"),
  jobPostId: z.cuid2("A valid job post ID is required"),
});

export type CreateCoverLetterInput = z.infer<
  typeof coverLetterSchema
>;