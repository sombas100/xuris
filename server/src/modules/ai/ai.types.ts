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

export type JobExtractionResult = {
  title: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

export type ResumeJobMatchResult = {
  matchScore: number;
  summary: string;
  matchingStrengths: string[];
  missingRequirements: string[];
  missingKeywords: string[];
  recommendedResumeChanges: string[];
  riskAreas: string[];
  interviewFocusAreas: string[];
};

export type JobMatchParams = {
    resumeText: string;
    jobTitle: string;
    company?: string | null;
    jobDescription: string;
    requirements?: unknown;
    responsibilities?: unknown;
  }

  export type ResumeJobMatchAIResponse = {
  result: ResumeJobMatchResult;
  usage: AIUsage;
};

export type CoverLetterResult = {
  title: string;
  content: string;
  tone: string;
  keyPoints: string[];
}

export type CoverLetterAIResponse = {
  result: CoverLetterResult;
  usage: AIUsage;
}

export type CoverLetterParams = {
  resumeText: string;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  requirements?: unknown;
  responsibilities?: unknown;
}

export type InterviewQuestion = {
  question: string;
  reason: string;
  suggestedAnswer: string;
};

export type InterviewPrepResult = {
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  summary: string;
  technicalQuestions: InterviewQuestion[];
  behaviouralQuestions: InterviewQuestion[];
  roleSpecificQuestions: InterviewQuestion[];
  weaknessAreas: string[];
  questionsToAsk: string[];
  tips: string[];
};

export type InterviewPrepAIResponse = {
  result: InterviewPrepResult;
  usage: AIUsage;
};

export type GenerateInterviewPrepParams = {
  resumeText: string;
  jobTitle: string;
  company?: string | null;
  jobDescription: string;
  requirements?: unknown;
  responsibilities?: unknown;
  jobMatchSummary?: string | null;
  jobMatchWeaknesses?: unknown;
  jobMatchMissingKeywords?: unknown;
}