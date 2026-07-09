type BuildInterviewPrepPromptParams = {
  resumeText: string;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  requirements?: unknown;
  responsibilities?: unknown;
  jobMatchSummary?: string | null;
  jobMatchWeaknesses?: unknown;
  jobMatchMissingKeywords?: unknown;
};

export function buildInterviewPrepPrompt({
  resumeText,
  jobTitle,
  company,
  jobDescription,
  requirements,
  responsibilities,
  jobMatchSummary,
  jobMatchWeaknesses,
  jobMatchMissingKeywords,
}: BuildInterviewPrepPromptParams) {
  return `
You are an experienced hiring manager, senior software engineer, recruiter, and interview coach.

Your task is to prepare this candidate for an upcoming interview.

Use:
- the candidate's resume
- the job description
- the previous resume-to-job match analysis

Generate realistic interview preparation that reflects what this specific employer is likely to ask.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations outside the JSON.
Do not invent experience that is not present in the resume.
Base suggested answers only on information contained in the resume.

Return this exact JSON structure:

{
  "difficulty": "BEGINNER | INTERMEDIATE | ADVANCED",

  "summary": string,

  "technicalQuestions": [
    {
      "question": string,
      "reason": string,
      "suggestedAnswer": string
    }
  ],

  "behaviouralQuestions": [
    {
      "question": string,
      "reason": string,
      "suggestedAnswer": string
    }
  ],

  "roleSpecificQuestions": [
    {
      "question": string,
      "reason": string,
      "suggestedAnswer": string
    }
  ],

  "weaknessAreas": [
    string
  ],

  "questionsToAsk": [
    string
  ],

  "tips": [
    string
  ]
}

Rules:

- Generate exactly 5 technical questions.
- Generate exactly 5 behavioural questions.
- Generate exactly 5 role-specific questions.
- Every question must include:
  - question
  - reason
  - suggestedAnswer
- Questions should become progressively more difficult.
- Focus heavily on the technologies, responsibilities and experience mentioned in the job description.
- Use the previous job-match analysis to target the candidate's weakest areas.
- Suggested answers should sound realistic and should never fabricate experience.
- Tips should be practical interview advice specific to this role.
- QuestionsToAsk should contain thoughtful questions the candidate can ask the interviewer.

Job Title:
${jobTitle}

Company:
${company ?? "Not provided"}

Job Description:

"""
${jobDescription}
"""

Requirements:

${JSON.stringify(requirements ?? [], null, 2)}

Responsibilities:

${JSON.stringify(responsibilities ?? [], null, 2)}

Previous Job Match Summary:

"""
${jobMatchSummary ?? "Not provided"}
"""

Weaknesses Identified:

${JSON.stringify(jobMatchWeaknesses ?? [], null, 2)}

Missing Keywords:

${JSON.stringify(jobMatchMissingKeywords ?? [], null, 2)}

Resume:

"""
${resumeText}
"""
`;
}