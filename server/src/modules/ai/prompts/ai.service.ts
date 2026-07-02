import { openai } from "../../../lib/openai";
import { buildResumeAnalysisPrompt } from "./resume.prompt";

const analyzeResume= async(resumeText: string) => {
    const prompt = buildResumeAnalysisPrompt({ resumeText });

    const response = await openai.responses.create({
        model: 'gpt-5.4-mini',
        input: prompt,
    })

    return response.output_text;
}

export const aiService = { analyzeResume };