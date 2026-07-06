export type ResumeAnalysisResult = {
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

export type AIUsage = {
  modelUsed: string;
  promptTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

export type ResumeAnalysisAIResponse = {
  result: ResumeAnalysisResult;
  usage: AIUsage;
};