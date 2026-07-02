type BuildResumePromptParams = {
  resumeText: string;
};

export function buildResumeAnalysisPrompt({
  resumeText,
}: BuildResumePromptParams) {
  return `
You are an expert technical recruiter, ATS specialist, and career coach.

Your task is to analyze a candidate's resume.

Evaluate the resume based on:
- ATS compatibility
- clarity
- professionalism
- structure
- technical skills
- work experience
- projects
- education
- grammar and spelling
- overall competitiveness

Return ONLY valid JSON using this exact structure:

{
  "atsScore": number,
  "summary": string,
  "strengths": [
    string
  ],
  "weaknesses": [
    string
  ],
  "improvements": [
    string
  ]
}

Rules:
- atsScore must be between 0 and 100.
- strengths should explain what the resume does well.
- weaknesses should explain what is missing or unclear.
- improvements should be practical and specific.
- Do not include markdown.
- Do not include text outside the JSON.

Resume text:
"""
${resumeText}
"""
`;
}