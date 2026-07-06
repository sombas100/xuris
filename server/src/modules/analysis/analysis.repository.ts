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

export const analysisRepository = () => {
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

    return { createResumeAnalysis }
}