import { openai } from "../../lib/openai";
import { resumeRepository } from "../resume/resume.repository";
import { HttpError } from "../../errors/HttpError";
import { env } from "../../config/env";
import { buildResumeAnalysisPrompt } from "../ai/prompts/resume-analysis.prompt";
import { analysisRepository } from "./analysis.repository";

const resumes = resumeRepository();
const analysis = analysisRepository();

type ResumeAnalysisResult = {
  overallScore: number;
  scores: {
    atsCompatibility: number;
    formatting: number;
    clarity: number;
    technicalSkills: number;
    experience: number;
    projects: number;
    education: number;
    grammar: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missingKeywords: string[];
  recommendedJobTitles: string[];
};

export const analysisService = () => {
    async function analyseResume(resumeId: string, userId: string) {
        const resume = await resumes.retrieveResume(resumeId);

        if (!resume)
            throw new HttpError("Resume not found", 404, "RESUME_NOT_FOUND");

        if (!resume.extractedText)
            throw new HttpError("Resume text has not been extracted yet", 400, "RESUME_TEXT_NOT_EXTRACTED");

        const prompt = buildResumeAnalysisPrompt({
            resumeText: resume.extractedText
        })

        const response = await openai.responses.create({
            model: env.OPENAI_MODEL,
            input: prompt,
        })

        const text = response.output_text;

        if (!text)
            throw new HttpError('The ai did not return a response', 500, 'AI_EMPTY_RESPONSE');

        let parsed: ResumeAnalysisResult;
        try {
            parsed = JSON.parse(text);  
        } catch (error) {
            throw new HttpError('Ai returned invalid JSON', 400, 'AI_INVALID_JSON');
        }

        const savedAnalysis = await analysis.createResumeAnalysis({
            userId,
            resumeId,
            result: parsed,
            modelUsed: env.OPENAI_MODEL,
            promptTokens: response.usage?.input_tokens,
            outputTokens: response.usage?.output_tokens,
            totalTokens: response.usage?.total_tokens,
        })

        return savedAnalysis;
    }

    return {
        analyseResume,
    }
}