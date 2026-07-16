import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";

import { UsageType } from "../../../generated/prisma/enums";

import { aiService } from "../ai/ai.service";
import { analysisRepository } from "../analysis/analysis.repository";
import { jobRepository } from "../job/job.repository";
import { resumeRepository } from "../resume/resume.repository";
import { usageService } from "../usage/usage.service";

import { interviewPrepRepository } from "./interview-prep.repository";

const ai = aiService();
const resumeRepo = resumeRepository();
const jobRepo = jobRepository();
const analysisRepo = analysisRepository();
const repository = interviewPrepRepository();
const usage = usageService();

export const interviewPrepService = () => {
  async function createInterviewPrep({
    userId,
    resumeId,
    jobPostId,
  }: {
    userId: string;
    resumeId: string;
    jobPostId: string;
  }) {
    const resume = await resumeRepo.retrieveResume(
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

    const jobPost = await jobRepo.retrieveJobPost(
      jobPostId,
      userId,
    );

    if (!jobPost) {
      throw new NotFoundError(
        "Job post not found",
        "JOB_POST_NOT_FOUND",
      );
    }

    const latestJobMatch =
      await analysisRepo.getLatestJobMatch(
        resumeId,
        jobPostId,
        userId,
      );

    const reservation =
      await usage.reserveUsage(userId);

    let aiResponse;

    try {
      aiResponse =
        await ai.generateInterviewPrep({
          resumeText: resume.extractedText,
          jobTitle: jobPost.title,
          company: jobPost.company,
          jobDescription: jobPost.description,
          requirements: jobPost.requirements,
          responsibilities:
            jobPost.responsibilities,
          jobMatchSummary:
            latestJobMatch?.summary,
          jobMatchWeaknesses:
            latestJobMatch?.weaknesses,
          jobMatchMissingKeywords:
            latestJobMatch?.missingKeywords,
        });
    } catch (error) {
      await usage.releaseUsage(reservation);

      throw error;
    }

    const savedInterviewPrep =
      await repository.createInterviewPrep({
        userId,
        resumeId,
        jobPostId,

        difficulty:
          aiResponse.result.difficulty,

        summary:
          aiResponse.result.summary,

        technicalQuestions:
          aiResponse.result.technicalQuestions,

        behaviouralQuestions:
          aiResponse.result.behaviouralQuestions,

        roleSpecificQuestions:
          aiResponse.result.roleSpecificQuestions,

        weaknessAreas:
          aiResponse.result.weaknessAreas,

        questionsToAsk:
          aiResponse.result.questionsToAsk,

        tips:
          aiResponse.result.tips,

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
      type: UsageType.INTERVIEW_PREP,
      resourceId: savedInterviewPrep.id,
      tokensUsed:
        aiResponse.usage.totalTokens,
    });

    return savedInterviewPrep;
  }

  async function getInterviewPrepById(
    interviewPrepId: string,
    userId: string,
  ) {
    const interviewPrep =
      await repository.getInterviewPrepById(
        interviewPrepId,
        userId,
      );

    if (!interviewPrep) {
      throw new NotFoundError(
        "Interview preparation not found",
        "INTERVIEW_PREP_NOT_FOUND",
      );
    }

    return interviewPrep;
  }

  async function getInterviewPrepsByResumeAndJob(
    resumeId: string,
    jobPostId: string,
    userId: string,
  ) {
    return repository.getInterviewPrepsByResumeAndJob(
      resumeId,
      jobPostId,
      userId,
    );
  }

  return {
    createInterviewPrep,
    getInterviewPrepById,
    getInterviewPrepsByResumeAndJob,
  };
};