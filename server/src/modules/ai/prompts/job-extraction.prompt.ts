type BuildJobExtractionPromptParams = {
  rawText: string;
};

export function buildJobExtractionPrompt({
  rawText,
}: BuildJobExtractionPromptParams) {
  return `
You are an expert job advert parser.

Extract structured information from the pasted job advert.

Return ONLY valid JSON using this exact structure:

{
  "title": string,
  "company": string | null,
  "location": string | null,
  "salary": string | null,
  "description": string,
  "requirements": [
    string
  ],
  "responsibilities": [
    string
  ]
}

Rules:
- Do not include markdown.
- Do not include text outside the JSON.
- If title is unclear, infer the most likely title.
- If company, location, or salary are missing, use null.
- description should be a cleaned version of the full job advert.
- requirements should include skills, experience, qualifications, and must-have criteria.
- responsibilities should include duties, tasks, and role expectations.
- Do not invent information that is not present or clearly implied.

Job advert:
"""
${rawText}
"""
`;
}