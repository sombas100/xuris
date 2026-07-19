import { resumeRepository } from "../resume/resume.repository";
import { analysisRepository } from "./analysis.repository";
import { jobRepository } from "../job/job.repository";
import { aiService } from "../ai/ai.service";
import { usageService } from "../usage/usage.service";

import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";

import { UsageType } from "../../../generated/prisma/enums";

const resumeRepo = resumeRepository();
const analysisRepo = analysisRepository();
const jobRepo = jobRepository();
const ai = aiService();
const usage = usageService();

export const analysisService = () => {
  async function analyseResume(
    resumeId: string,
    userId: string,
  ) {
    const resume =
      await resumeRepo.retrieveResume(
        resumeId,
        userId,
      );

    if (!resume) {
      throw new NotFoundError(
        "Resume not found",
        "RESUME_NOT_FOUND",
      );
    }

    if (!resume.extractedText) {
      throw new BadRequestError(
        "Resume text has not been extracted yet",
        "RESUME_TEXT_NOT_EXTRACTED",
      );
    }

    const reservation =
      await usage.reserveUsage(userId);

    try {
      const aiResponse =
        await ai.analyzeResume(
          resume.extractedText,
        );

      const savedAnalysis =
        await analysisRepo.createResumeAnalysis({
          userId,
          resumeId,

          result: aiResponse.result,

          modelUsed:
            aiResponse.usage.modelUsed,

          promptTokens:
            aiResponse.usage.promptTokens,

          outputTokens:
            aiResponse.usage.outputTokens,

          totalTokens:
            aiResponse.usage.totalTokens,
        });

      await usage.recordUsage({
        userId,
        type: UsageType.RESUME_ANALYSIS,

        resourceId: savedAnalysis.id,

        tokensUsed:
          aiResponse.usage.totalTokens,
      });

      return savedAnalysis;
    } catch (error) {
      await usage.releaseUsage(reservation);
      throw error;
    }
  }

  async function createJobMatchAnalysis({
    userId,
    resumeId,
    jobPostId,
  }: {
    userId: string;
    resumeId: string;
    jobPostId: string;
  }) {
    const resume =
      await resumeRepo.retrieveResume(
        resumeId,
        userId,
      );

    if (!resume) {
      throw new NotFoundError(
        "Resume not found",
        "RESUME_NOT_FOUND",
      );
    }

    if (!resume.extractedText) {
      throw new BadRequestError(
        "Resume text has not been extracted yet",
        "RESUME_TEXT_NOT_EXTRACTED",
      );
    }

    const jobPost =
      await jobRepo.retrieveJobPost(
        jobPostId,
        userId,
      );

    if (!jobPost) {
      throw new NotFoundError(
        "Job post not found",
        "JOB_POST_NOT_FOUND",
      );
    }

    const reservation =
      await usage.reserveUsage(userId);

    try {
      const aiResponse =
        await ai.matchResumeToJob({
          resumeText:
            resume.extractedText,

          jobTitle:
            jobPost.title,

          company:
            jobPost.company,

          jobDescription:
            jobPost.description,

          requirements:
            jobPost.requirements,

          responsibilities:
            jobPost.responsibilities,
        });

      const analysis =
        await analysisRepo
          .createResumeJobMatchAnalysis({
            userId,
            resumeId,
            jobPostId,

            result:
              aiResponse.result,

            modelUsed:
              aiResponse.usage.modelUsed,

            promptTokens:
              aiResponse.usage.promptTokens,

            outputTokens:
              aiResponse.usage.outputTokens,

            totalTokens:
              aiResponse.usage.totalTokens,
          });

      await usage.recordUsage({
        userId,
        type: UsageType.JOB_COMPARISON,

        resourceId:
          analysis.id,

        tokensUsed:
          aiResponse.usage.totalTokens,
      });

      return analysis;
    } catch (error) {
      await usage.releaseUsage(reservation);
      throw error;
    }
  }

  async function getAnalysisById(
    id: string,
    userId: string,
  ) {
    const analysis =
      await analysisRepo.getAnalysisById(
        id,
        userId,
      );

    if (!analysis) {
      throw new NotFoundError(
        "Analysis not found",
        "ANALYSIS_NOT_FOUND",
      );
    }

    return analysis;
  }

  async function getResumeAnalyses(
    resumeId: string,
    userId: string,
  ) {
    return analysisRepo.getResumeAnalyses(
      resumeId,
      userId,
    );
  }

  async function getJobMatchAnalysisByJobId(
    jobPostId: string,
    userId: string,
  ) {
    const analysis =
      await analysisRepo
        .getJobMatchAnalysisByJobId(
          jobPostId,
          userId,
        );

    if (!analysis) {
      throw new NotFoundError(
        "Analysis not found",
        "ANALYSIS_NOT_FOUND",
      );
    }

    return analysis;
  }

  async function getJobMatchAnalysisByResumeId(
    resumeId: string,
    userId: string,
  ) {
    return analysisRepo
      .getJobMatchAnalysesByResumeId(
        resumeId,
        userId,
      );
  }

  return {
    createJobMatchAnalysis,
    analyseResume,
    getAnalysisById,
    getResumeAnalyses,
    getJobMatchAnalysisByJobId,
    getJobMatchAnalysisByResumeId,
  };
};