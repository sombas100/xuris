import { openai } from "../../lib/openai";
import { buildResumeAnalysisPrompt } from "./prompts/resume-analysis.prompt";
import { env } from "../../config/env";

const analyzeResume= async(resumeText: string) => {
    const prompt = buildResumeAnalysisPrompt({ resumeText });

    const response = await openai.responses.create({
        model: env.OPENAI_MODEL,
        input: prompt,
    })

    return response.output_text;
}

export const aiService = { analyzeResume };