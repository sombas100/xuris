import { AnalysisStatus, AnalysisType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const RECENT_ACTIVITY_LIMIT = 6;

export const dashboardRepository = () => {
  async function getSummaryCounts(userId: string) {
    const [
      resumeAnalyses,
      jobComparisons,
      interviewSessions,
      applications,
    ] = await Promise.all([
      prisma.aIAnalysis.count({
        where: {
          userId,
          type: AnalysisType.RESUME_REVIEW,
          status: AnalysisStatus.COMPLETED,
        },
      }),

      prisma.aIAnalysis.count({
        where: {
          userId,
          type: AnalysisType.JOB_MATCH,
          status: AnalysisStatus.COMPLETED,
        },
      }),

      prisma.interviewPrep.count({
        where: {
          userId,
        },
      }),

      prisma.jobApplication.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      resumeAnalyses,
      jobComparisons,
      interviewSessions,
      applications,
    };
  }

  async function getRecentAnalyses(userId: string) {
    return prisma.aIAnalysis.findMany({
      where: {
        userId,
        status: AnalysisStatus.COMPLETED,
        type: {
          in: [
            AnalysisType.RESUME_REVIEW,
            AnalysisType.JOB_MATCH,
          ],
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: RECENT_ACTIVITY_LIMIT,

      select: {
        id: true,
        type: true,
        overallScore: true,
        summary: true,
        createdAt: true,

        resume: {
          select: {
            id: true,
            title: true,
          },
        },

        jobPost: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });
  }

  async function getResumeScoreSummary(userId: string) {
    return prisma.aIAnalysis.aggregate({
      where: {
        userId,
        type: AnalysisType.RESUME_REVIEW,
        status: AnalysisStatus.COMPLETED,
        overallScore: {
          not: null,
        },
      },

      _avg: {
        overallScore: true,
      },
    });
  }

  async function getLatestResumeAnalysis(userId: string) {
    return prisma.aIAnalysis.findFirst({
      where: {
        userId,
        type: AnalysisType.RESUME_REVIEW,
        status: AnalysisStatus.COMPLETED,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        overallScore: true,
        atsCompatibilityScore: true,
        formattingScore: true,
        clarityScore: true,
        technicalSkillsScore: true,
        experienceScore: true,
        projectsScore: true,
        educationScore: true,
        grammarScore: true,
        createdAt: true,

        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  return {
    getSummaryCounts,
    getRecentAnalyses,
    getResumeScoreSummary,
    getLatestResumeAnalysis,
  };
};