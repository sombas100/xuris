export const queryKeys = {
  resumes: {
    all: ["resumes"] as const,
    list: () => [...queryKeys.resumes.all, "list"] as const,
    detail: (resumeId: string) =>
      [...queryKeys.resumes.all, "detail", resumeId] as const,
    analysis: (resumeId: string) =>
      [...queryKeys.resumes.all, "analysis", resumeId] as const,
  },

  resumeAnalysis: {
    all: ["resume-analysis"] as const,

    lists: () =>
      [...queryKeys.resumeAnalysis.all, "list"] as const,

    byResume: (resumeId: string) =>
      [
        ...queryKeys.resumeAnalysis.lists(),
        "resume",
        resumeId,
      ] as const,

    detail: (analysisId: string) =>
      [
        ...queryKeys.resumeAnalysis.all,
        "detail",
        analysisId,
      ] as const,
  },

  dashboard: {
  all: ["dashboard"] as const,

  summary: () =>
    [...queryKeys.dashboard.all, "summary"] as const,
},
} as const;