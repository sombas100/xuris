import { prisma } from "../../lib/prisma";
import { AnalysisStatus, AnalysisType } from "../../../generated/prisma/enums";

type CreateResumeAnalysisData = {
  userId: string;
  resumeId: string;
  result: any;
  modelUsed?: string;
  promptTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

type CreateResumeJobMatchProps = {
  userId: string;
  resumeId: string;
  jobPostId: string;
  result: {
    matchScore: number;
    summary: string;
    matchingStrengths: string[];
    missingRequirements: string[];
    missingKeywords: string[];
    recommendedResumeChanges: string[];
    riskAreas: string[];
    interviewFocusAreas: string[];
  };
  modelUsed?: string;
  promptTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export const analysisRepository = () => {
    async function createResumeJobMatchAnalysis(data: CreateResumeJobMatchProps) {
        return prisma.aIAnalysis.create({
            data: {
                userId: data.userId,
                resumeId: data.resumeId,
                jobPostId: data.jobPostId,
                type: 'JOB_MATCH',
                status: 'COMPLETED',
                overallScore: data.result.matchScore,
                summary: data.result.summary,
                strengths: data.result.matchingStrengths,
                weaknesses: data.result.riskAreas,
                improvements: data.result.recommendedResumeChanges,
                missingKeywords: data.result.missingKeywords,
                modelUsed: data.modelUsed,
                promptTokens: data.promptTokens,
                outputTokens: data.outputTokens,
                totalTokens: data.totalTokens,
            }
        })
    }

    async function createResumeAnalysis(data: CreateResumeAnalysisData) {
        return prisma.aIAnalysis.create({
            data: {
                userId: data.userId,
                resumeId: data.resumeId,
                type: AnalysisType.RESUME_REVIEW,
                status: AnalysisStatus.COMPLETED,
    
                overallScore: data.result.overallScore,
                atsCompatibilityScore: data.result.scores.atsCompatibility,
                formattingScore: data.result.scores.formatting,
                clarityScore: data.result.scores.clarity,
                technicalSkillsScore: data.result.scores.technicalSkills,
                experienceScore: data.result.scores.experience,
                projectsScore: data.result.scores.projects,
                educationScore: data.result.scores.education,
                grammarScore: data.result.scores.grammar,
    
                summary: data.result.summary,
                strengths: data.result.strengths,
                weaknesses: data.result.weaknesses,
                improvements: data.result.improvements,
                missingKeywords: data.result.missingKeywords,
                recommendedJobTitles: data.result.recommendedJobTitles,
    
                modelUsed: data.modelUsed,
                promptTokens: data.promptTokens,
                outputTokens: data.outputTokens,
                totalTokens: data.totalTokens,
            }
        })
    }

    async function getAnalysisById(id: string, userId: string) {
        return prisma.aIAnalysis.findUnique({
            where: { id, userId }
        })
    }

    async function getResumeAnalyses(resumeId: string, userId: string) {
        return prisma.aIAnalysis.findMany({
            where: { resumeId, userId, type: AnalysisType.RESUME_REVIEW },
            orderBy: {
                createdAt: 'desc'
            },
        })
    }

    async function getJobMatchAnalysisByJobId(jobPostId: string, userId: string) {
        return prisma.aIAnalysis.findFirst({
            where: { jobPostId, userId, type: AnalysisType.JOB_MATCH },
            orderBy: {
                createdAt: 'desc',
            }
        })
    }

    async function getJobMatchAnalysesByResumeId(resumeId: string, userId: string) {
        return prisma.aIAnalysis.findMany({
            where: { resumeId, userId, type: AnalysisType.JOB_MATCH },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    async function getLatestJobMatch(resumeId: string, jobPostId: string) {
        return prisma.aIAnalysis.findFirst({
            where: { resumeId, jobPostId, type: 'JOB_MATCH' },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    return { 
        createResumeAnalysis, 
        getAnalysisById, 
        getResumeAnalyses, 
        createResumeJobMatchAnalysis,
        getJobMatchAnalysisByJobId,
        getJobMatchAnalysesByResumeId,
        getLatestJobMatch,
    }
}