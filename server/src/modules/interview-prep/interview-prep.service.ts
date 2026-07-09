import { BadRequestError } from "../../errors/BadRequestError";
import { NotFoundError } from "../../errors/NotFoundError";

import { aiService } from "../ai/ai.service";
import { resumeRepository } from "../resume/resume.repository";
import { jobRepository } from "../job/job.repository";
import { analysisRepository } from "../analysis/analysis.repository";
import { interviewPrepRepository } from "./interview-prep.repository";

const ai = aiService();
const resumeRepo = resumeRepository();
const jobRepo = jobRepository();
const analysisRepo = analysisRepository();
const repository = interviewPrepRepository();

export const interviewPrepService = () => {
    async function createInterviewPrep({ 
        userId,
        resumeId,
        jobPostId,
    }: {
        userId: string,
        resumeId: string,
        jobPostId: string
    }) {
        const resume = await resumeRepo.retrieveResume(resumeId);

        if (!resume)
            throw new NotFoundError('Resume not found', 'RESUME_NOT_FOUND');

        if (!resume.extractedText) {
            throw new BadRequestError(
            "Resume text has not been extracted yet",
            "RESUME_TEXT_NOT_EXTRACTED"
            );
        }

        const jobPost = await jobRepo.retrieveJobPost(jobPostId);

        if (!jobPost)
            throw new NotFoundError('Job post not found', 'JOB_POST_NOT_FOUND');

        const latestJobMatch = await analysisRepo.getLatestJobMatch(resumeId, jobPostId)

        const aiResponse = await ai.generateInterviewPrep({
            resumeText: resume.extractedText,
            jobTitle: jobPost.title,
            company: jobPost.company,
            jobDescription: jobPost.description,
            requirements: jobPost.requirements,
            responsibilities: jobPost.responsibilities,
            jobMatchSummary: latestJobMatch?.summary,
            jobMatchWeaknesses: latestJobMatch?.weaknesses,
            jobMatchMissingKeywords: latestJobMatch?.missingKeywords,
        })

        return repository.createInterviewPrep({
            userId,
            resumeId,
            jobPostId,
            difficulty: aiResponse.result.difficulty,
            summary: aiResponse.result.summary,
            technicalQuestions: aiResponse.result.technicalQuestions,
            behaviouralQuestions: aiResponse.result.behaviouralQuestions,
            roleSpecificQuestions: aiResponse.result.roleSpecificQuestions,
            weaknessAreas: aiResponse.result.weaknessAreas,
            questionsToAsk: aiResponse.result.questionsToAsk,
            tips: aiResponse.result.tips,
        })
    }

    return { createInterviewPrep }
}