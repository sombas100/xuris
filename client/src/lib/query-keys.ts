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

  jobPosts: {
    all: ["job-posts"] as const,

    list: () =>
      [...queryKeys.jobPosts.all, "list"] as const,

    detail: (jobPostId: string) =>
      [
        ...queryKeys.jobPosts.all,
        "detail",
        jobPostId,
      ] as const,
  },

  jobComparison: {
    all: ["job-comparison"] as const,

    byResume: (resumeId: string) =>
      [
        ...queryKeys.jobComparison.all,
        "resume",
        resumeId,
      ] as const,

    detail: (analysisId: string) =>
      [
        ...queryKeys.jobComparison.all,
        "detail",
        analysisId,
      ] as const,
  },

  dashboard: {
  all: ["dashboard"] as const,

  summary: () =>
    [...queryKeys.dashboard.all, "summary"] as const,
},

interviewPrep: {
  all: ["interview-prep"] as const,

  byResumeAndJob: (
    resumeId: string,
    jobPostId: string,
  ) =>
    [
      ...queryKeys.interviewPrep.all,
      "resume",
      resumeId,
      "job",
      jobPostId,
    ] as const,

  detail: (interviewPrepId: string) =>
    [
      ...queryKeys.interviewPrep.all,
      "detail",
      interviewPrepId,
    ] as const,
},

} as const;