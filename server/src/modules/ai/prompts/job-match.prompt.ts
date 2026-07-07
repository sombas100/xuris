type BuildResumeJobMatchPromptParams = {
  resumeText: string;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  requirements?: unknown;
  responsibilities?: unknown;
};

export function buildResumeJobMatchPrompt({
  resumeText,
  jobTitle,
  company,
  jobDescription,
  requirements,
  responsibilities,
}: BuildResumeJobMatchPromptParams) {
  return `
You are an expert ATS reviewer, recruiter, hiring manager, and career coach.

Compare the candidate's resume against the job description.

Return ONLY valid JSON.
Do not include markdown.
Do not include text outside the JSON.
Do not invent experience that is not present in the resume.

Use this exact JSON structure:

{
  "matchScore": number,
  "summary": string,
  "matchingStrengths": [
    string
  ],
  "missingRequirements": [
    string
  ],
  "missingKeywords": [
    string
  ],
  "recommendedResumeChanges": [
    string
  ],
  "riskAreas": [
    string
  ],
  "interviewFocusAreas": [
    string
  ]
}

Rules:
- matchScore must be an integer between 0 and 100.
- matchingStrengths should identify where the resume clearly matches the job.
- missingRequirements should identify job requirements not clearly shown in the resume.
- missingKeywords should list important terms from the job advert missing from the resume.
- recommendedResumeChanges must be practical and specific.
- riskAreas should explain why the candidate may be screened out.
- interviewFocusAreas should suggest areas the candidate should prepare to discuss.
- Base everything only on the resume and job advert.

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