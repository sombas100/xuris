import { openai } from "../../lib/openai";
import { env } from "../../config/env";

import { buildResumeAnalysisPrompt } from "./prompts/resume-analysis.prompt";
import { buildJobExtractionPrompt } from "./prompts/job-extraction.prompt";

import type { CoverLetterAIResponse, CoverLetterParams, CoverLetterResult, JobExtractionResult, JobMatchParams } from "./ai.types";
import type { ResumeAnalysisAIResponse, ResumeAnalysisResult } from "./ai.types";

import { buildResumeJobMatchPrompt } from "./prompts/job-match.prompt";
import type { ResumeJobMatchResult } from "./ai.types";

import type { ResumeJobMatchAIResponse } from "./ai.types";
import { InternalServerError } from "../../errors/InternalServerError";
import { buildCoverLetterPrompt } from "./prompts/cover-letter.prompt";

import { buildInterviewPrepPrompt } from "./prompts/interview-prep.prompt";
import type { InterviewPrepAIResponse, InterviewPrepResult, GenerateInterviewPrepParams } from "./ai.types";
import { ps } from "zod/v4/locales";

export const aiService = () => {
  async function analyzeResume(resumeText: string): Promise<ResumeAnalysisAIResponse> {
    const prompt = buildResumeAnalysisPrompt({ resumeText });

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt,
    });

    const text = response.output_text;

    if (!text) {
      throw new InternalServerError("AI did not return a response", "AI_EMPTY_RESPONSE");
    }

    let parsed: ResumeAnalysisResult;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new InternalServerError("AI returned invalid JSON", "AI_INVALID_JSON");
    }

    return {
      result: parsed,
      usage: {
        modelUsed: env.OPENAI_MODEL,
        promptTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.total_tokens,
      },
    };
  }

  async function extractJobPostFromText(rawText: string): Promise<JobExtractionResult> {
    const prompt = buildJobExtractionPrompt({ rawText })

    const response = await openai.responses.create({
        model: env.OPENAI_MODEL,
        input: prompt,
    })

    const text = response.output_text;

    if (!text) {
    throw new InternalServerError("AI did not return a response", "AI_EMPTY_RESPONSE");
  }

  try {
    return JSON.parse(text) as JobExtractionResult;
  } catch (error) {
    throw new InternalServerError("AI returned invalid JSON", "AI_INVALID_JSON");
  }
  }

  async function matchResumeToJob(
    params: JobMatchParams
  ): Promise<ResumeJobMatchAIResponse> {
    const prompt = buildResumeJobMatchPrompt(params);

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt,
    });

    const text = response.output_text;

    if (!text) {
      throw new InternalServerError("AI did not return a response", "AI_EMPTY_RESPONSE");
    }

    let parsed: ResumeJobMatchResult;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new InternalServerError("AI returned invalid JSON", "AI_INVALID_JSON");
    }

    return {
      result: parsed,
      usage: {
        modelUsed: env.OPENAI_MODEL,
        promptTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.total_tokens,
      },
    };
  }

  async function generateCoverLetter(params: CoverLetterParams): Promise<CoverLetterAIResponse> {
    const prompt = buildCoverLetterPrompt(params);

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt,
    })

    const text = response.output_text;

    if (!text) 
      throw new InternalServerError("AI did not return a response", "AI_EMPTY_RESPONSE");
    
    let parsed: CoverLetterResult;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
       throw new InternalServerError("AI returned invalid JSON", "AI_INVALID_JSON");
    }

    return {
      result: parsed,
      usage: {
        modelUsed: env.OPENAI_MODEL,
        promptTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.total_tokens,
      }
    }
  }

  async function generateInterviewPrep(params: GenerateInterviewPrepParams): Promise<InterviewPrepAIResponse> {
    const prompt = buildInterviewPrepPrompt(params);

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt,
    })

    const text = response.output_text;

    if (!text)
      throw new InternalServerError('Ai did not return a response', 'AI_EMPTY_RESPONSE');

    let parsed: InterviewPrepResult;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw new InternalServerError("AI returned invalid JSON", "AI_INVALID_JSON")
    }

    return {
      result: parsed,
      usage: {
        modelUsed: env.OPENAI_MODEL,
        promptTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens: response.usage?.total_tokens,
      }
    }
  }

  return {
    analyzeResume,
    extractJobPostFromText,
    matchResumeToJob,
    generateCoverLetter,
    generateInterviewPrep,
  };
};