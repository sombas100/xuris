type BuildCoverLetterPromptParams = {
  resumeText: string;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  requirements?: unknown;
  responsibilities?: unknown;
};

export function buildCoverLetterPrompt({
  resumeText,
  jobTitle,
  company,
  jobDescription,
  requirements,
  responsibilities,
}: BuildCoverLetterPromptParams) {
  return `
You are an expert career coach and professional cover letter writer.

Write a tailored cover letter for the candidate based only on the supplied resume and job description.

Return ONLY valid JSON.
Do not include markdown.
Do not include text outside the JSON.
Do not invent experience that is not present in the resume.

Use this exact JSON structure:

{
  "title": string,
  "content": string,
  "tone": string,
  "keyPoints": [
    string
  ]
}

Rules:
- title should be a short title for this cover letter.
- content should be a complete professional cover letter.
- tone should describe the tone, such as "professional", "confident", or "friendly-professional".
- keyPoints should list the main resume/job connections used in the letter.
- The cover letter should be specific to the job.
- Avoid generic phrases where possible.
- Keep the cover letter concise and realistic.

Job:
Title: ${jobTitle}
Company: ${company ?? "Not provided"}

Job description:
"""
${jobDescription}
"""

Requirements:
${JSON.stringify(requirements ?? [], null, 2)}

Responsibilities:
${JSON.stringify(responsibilities ?? [], null, 2)}

Resume:
"""
${resumeText}
"""
`;
}