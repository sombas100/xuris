export const queryKeys = {
  resumes: {
    all: ["resumes"] as const,
    lists: () => [...queryKeys.resumes.all, "list"] as const,
    detail: (resumeId: string) =>
      [...queryKeys.resumes.all, "detail", resumeId] as const,
    analysis: (resumeId: string) =>
      [...queryKeys.resumes.all, "analysis", resumeId] as const,
  },

  dashboard: {
    summary: ["dashboard", "summary"] as const,
  },
} as const;