import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";

import { aiService } from "../ai/ai.service";
import { jobRepository } from "../job/job.repository";
import { resumeRepository } from "../resume/resume.repository";

import { coverLetterRepository } from "./cover-letter.repository";
import type { CreateCoverLetterInput } from "./cover-letter.validation";

const ai = aiService();
const resumeRepo = resumeRepository();
const jobRepo = jobRepository();
const repository = coverLetterRepository();

export const coverLetterService = () => {
  async function createTailoredCoverLetter(
    data: CreateCoverLetterInput,
    userId: string,
  ) {
    const { resumeId, jobPostId } = data;

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

    const aiResponse = await ai.generateCoverLetter({
      resumeText: resume.extractedText,
      jobTitle: jobPost.title,
      company: jobPost.company,
      jobDescription: jobPost.description,
      requirements: jobPost.requirements,
      responsibilities: jobPost.responsibilities,
    });

    return repository.createCoverLetter({
      userId,
      resumeId,
      jobPostId,
      title: aiResponse.result.title,
      content: aiResponse.result.content,
      tone: aiResponse.result.tone,
      modelUsed: aiResponse.usage.modelUsed,
      promptTokens: aiResponse.usage.promptTokens,
      outputTokens: aiResponse.usage.outputTokens,
      totalTokens: aiResponse.usage.totalTokens,
    });
  }

  async function getCoverLetterById(
    coverLetterId: string,
    userId: string,
  ) {
    const coverLetter =
      await repository.retrieveCoverLetterById(
        coverLetterId,
        userId,
      );

    if (!coverLetter) {
      throw new NotFoundError(
        "Cover letter not found",
        "COVER_LETTER_NOT_FOUND",
      );
    }

    return coverLetter;
  }

  async function getCoverLettersByResumeAndJob(
    resumeId: string,
    jobPostId: string,
    userId: string,
  ) {
    return repository.retrieveCoverLettersByResumeAndJob(
      resumeId,
      jobPostId,
      userId,
    );
  }

  return {
    createTailoredCoverLetter,
    getCoverLetterById,
    getCoverLettersByResumeAndJob,
  };
};