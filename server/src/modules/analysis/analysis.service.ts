import { resumeRepository } from "../resume/resume.repository";
import { analysisRepository } from "./analysis.repository";
import { jobRepository } from "../job/job.repository";
import { aiService } from "../ai/ai.service";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";

const resumeRepo = resumeRepository();
const analysisRepo = analysisRepository();
const jobRepo = jobRepository();
const ai = aiService();

export const analysisService = () => {
  async function analyseResume(resumeId: string, userId: string) {
    const resume = await resumeRepo.retrieveResume(resumeId, userId);

    if (!resume) {
      throw new NotFoundError("Resume not found", "RESUME_NOT_FOUND");
    }

    if (!resume.extractedText) {
      throw new BadRequestError(
        "Resume text has not been extracted yet",
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
    const resume = await resumeRepo.retrieveResume(resumeId, userId);

    if (!resume) {
      throw new NotFoundError("Resume not found", "RESUME_NOT_FOUND");
    }

    if (!resume.extractedText) {
      throw new BadRequestError(
        "Resume text has not been extracted yet",
        "RESUME_TEXT_NOT_EXTRACTED"
      );
    }

    const jobPost = await jobRepo.retrieveJobPost(jobPostId);

    if (!jobPost) {
      throw new NotFoundError("Job post not found", "JOB_POST_NOT_FOUND");
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

  async function getAnalysisById(id: string, userId: string) {
    const analysis = await analysisRepo.getAnalysisById(id, userId);

    if (!analysis) {
      throw new NotFoundError("Analysis not found", "ANALYSIS_NOT_FOUND");
    }

    return analysis;
  }

  async function getResumeAnalyses(resumeId: string, userId: string) {
    return analysisRepo.getResumeAnalyses(resumeId, userId);
  }

  async function getJobMatchAnalysisByJobId(jobPostId: string, userId: string) {
    const analysis = await analysisRepo.getJobMatchAnalysisByJobId(jobPostId, userId);

    if (!analysis)
            throw new NotFoundError("Analysis not found", "ANALYSIS_NOT_FOUND");

    return analysis;
  }
  async function getJobMatchAnalysisByResumeId(resumeId: string, userId: string) {
    return analysisRepo.getJobMatchAnalysesByResumeId(resumeId, userId);
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