import { z } from "zod";

export const createInterviewPrepSchema = z.object({
  resumeId: z.cuid2("A valid resume ID is required"),
  jobPostId: z.cuid2("A valid job post ID is required"),
});

export type CreateInterviewPrepInput = z.infer<
  typeof createInterviewPrepSchema
>;