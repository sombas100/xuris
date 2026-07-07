import { openai } from "../../lib/openai";
import { env } from "../../config/env";
import { HttpError } from "../../errors/HttpError";
import { buildResumeAnalysisPrompt } from "./prompts/resume-analysis.prompt";
import { buildJobExtractionPrompt } from "./prompts/job-extraction.prompt";
import type { JobExtractionResult } from "./ai.types";
import type { ResumeAnalysisAIResponse, ResumeAnalysisResult } from "./ai.types";

export const aiService = () => {
  async function analyzeResume(resumeText: string): Promise<ResumeAnalysisAIResponse> {
    const prompt = buildResumeAnalysisPrompt({ resumeText });

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: prompt,
    });

    const text = response.output_text;

    if (!text) {
      throw new HttpError("AI did not return a response", 500, "AI_EMPTY_RESPONSE");
    }

    let parsed: ResumeAnalysisResult;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new HttpError("AI returned invalid JSON", 500, "AI_INVALID_JSON");
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
    throw new HttpError("AI did not return a response", 500, "AI_EMPTY_RESPONSE");
  }

  try {
    return JSON.parse(text) as JobExtractionResult;
  } catch (error) {
    throw new HttpError("AI returned invalid JSON", 500, "AI_INVALID_JSON");
  }
  }

  return {
    analyzeResume,
    extractJobPostFromText,
  };
};