import { resumeRepository } from "../resume/resume.repository";
import { HttpError } from "../../errors/HttpError";
import { analysisRepository } from "./analysis.repository";
import { jobRepository } from "../job/job.repository";
import { aiService } from "../ai/ai.service";
import { env } from "../../config/env";

const resumeRepo = resumeRepository();
const analysisRepo = analysisRepository();
const jobRepo = jobRepository();
const ai = aiService();

export const analysisService = () => {
  async function analyseResume(resumeId: string, userId: string) {
    const resume = await resumeRepo.retrieveResume(resumeId);

    if (!resume) {
      throw new HttpError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    if (!resume.extractedText) {
      throw new HttpError(
        "Resume text has not been extracted yet",
        400,
        "RESUME_TEXT_NOT_EXTRACTED"
      );
    }

    const aiResponse = await ai.analyzeResume(resume.extractedText);

    const savedAnalysis = await analysisRepo.createResumeAnalysis({
      userId,
      resumeId,
      result: aiResponse.result,
      modelUsed: aiResponse.usage.modelUsed,
      promptTokens: aiResponse.usage.promptTokens,
      outputTokens: aiResponse.usage.outputTokens,
      totalTokens: aiResponse.usage.totalTokens,
    });

    return savedAnalysis;
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
    const resume = await resumeRepo.retrieveResume(resumeId);

    if (!resume) {
      throw new HttpError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    if (!resume.extractedText) {
      throw new HttpError(
        "Resume text has not been extracted yet",
        400,
        "RESUME_TEXT_NOT_EXTRACTED"
      );
    }

    const jobPost = await jobRepo.retrieveJobPost(jobPostId);

    if (!jobPost) {
      throw new HttpError("Job post not found", 404, "JOB_POST_NOT_FOUND");
    }

    const aiResponse = await ai.matchResumeToJob({
      resumeText: resume.extractedText,
      jobTitle: jobPost.title,
      company: jobPost.company,
      jobDescription: jobPost.description,
      requirements: jobPost.requirements,
      responsibilities: jobPost.responsibilities,
    });

    return analysisRepo.createResumeJobMatchAnalysis({
      userId,
      resumeId,
      jobPostId,
      result: aiResponse.result,
      modelUsed: aiResponse.usage.modelUsed,
      promptTokens: aiResponse.usage.promptTokens,
      outputTokens: aiResponse.usage.outputTokens,
      totalTokens: aiResponse.usage.totalTokens,
    });
  }

  async function getAnalysisById(id: string) {
    const analysis = await analysisRepo.getAnalysisById(id);

    if (!analysis) {
      throw new HttpError("Analysis not found", 404, "ANALYSIS_NOT_FOUND");
    }

    return analysis;
  }

  async function getResumeAnalyses(resumeId: string) {
    return analysisRepo.getResumeAnalyses(resumeId);
  }

  return {
    createJobMatchAnalysis,
    analyseResume,
    getAnalysisById,
    getResumeAnalyses,
  };
};