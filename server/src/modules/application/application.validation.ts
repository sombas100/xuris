import { z } from "zod";

import { ApplicationStatus } from "../../generated/prisma/enums.js";

const optionalDateSchema = z
  .string()
  .datetime({ offset: true })
  .optional()
  .nullable();

export const createApplicationSchema = z
  .object({
    jobPostId: z.cuid2().optional(),
    resumeId: z.cuid2().optional(),
    coverLetterId: z.cuid2().optional(),

    company: z.string().trim().min(1).max(150).optional(),
    role: z.string().trim().min(1).max(150).optional(),

    jobUrl: z.url().optional().nullable(),
    location: z.string().trim().max(150).optional().nullable(),
    salary: z.string().trim().max(150).optional().nullable(),
    notes: z.string().trim().max(5000).optional().nullable(),

    status: z.nativeEnum(ApplicationStatus).default(
      ApplicationStatus.SAVED,
    ),

    appliedAt: optionalDateSchema,
    interviewAt: optionalDateSchema,
    followUpDate: optionalDateSchema,
    offerAt: optionalDateSchema,
    closedAt: optionalDateSchema,
  })
  .superRefine((data, context) => {
    if (!data.jobPostId && (!data.company || !data.role)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jobPostId"],
        message:
          "Provide either a saved job post or both a company and role.",
      });
    }
  });

export const updateApplicationSchema = z
  .object({
    resumeId: z.cuid2().optional().nullable(),
    jobPostId: z.cuid2().optional().nullable(),
    coverLetterId: z.cuid2().optional().nullable(),

    company: z.string().trim().min(1).max(150).optional(),
    role: z.string().trim().min(1).max(150).optional(),

    jobUrl: z.url().optional().nullable(),
    location: z.string().trim().max(150).optional().nullable(),
    salary: z.string().trim().max(150).optional().nullable(),
    notes: z.string().trim().max(5000).optional().nullable(),

    appliedAt: optionalDateSchema,
    interviewAt: optionalDateSchema,
    followUpDate: optionalDateSchema,
    offerAt: optionalDateSchema,
    closedAt: optionalDateSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),

  note: z.string().trim().max(1000).optional().nullable(),

  interviewAt: optionalDateSchema,
  followUpDate: optionalDateSchema,
});

export const applicationListQuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),

  search: z.string().trim().max(150).optional(),

  sort: z
    .enum([
      "createdAt",
      "updatedAt",
      "appliedAt",
      "followUpDate",
      "company",
      "role",
    ])
    .default("updatedAt"),

  order: z.enum(["asc", "desc"]).default("desc"),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(20),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;

export type UpdateApplicationInput = z.infer<
  typeof updateApplicationSchema
>;

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;

export type ApplicationListQuery = z.infer<
  typeof applicationListQuerySchema
>;
