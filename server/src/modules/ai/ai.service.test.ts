import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createResponse: vi.fn(),

  buildResumeAnalysisPrompt: vi.fn(),
  buildJobExtractionPrompt: vi.fn(),
  buildResumeJobMatchPrompt: vi.fn(),
  buildCoverLetterPrompt: vi.fn(),
  buildInterviewPrepPrompt: vi.fn(),
}));

vi.mock("../../lib/openai", () => ({
  openai: {
    responses: {
      create: mocks.createResponse,
    },
  },
}));

vi.mock("../../config/env", () => ({
  env: {
    OPENAI_MODEL: "test-openai-model",
  },
}));

vi.mock("./prompts/resume-analysis.prompt", () => ({
  buildResumeAnalysisPrompt:
    mocks.buildResumeAnalysisPrompt,
}));

vi.mock("./prompts/job-extraction.prompt", () => ({
  buildJobExtractionPrompt:
    mocks.buildJobExtractionPrompt,
}));

vi.mock("./prompts/job-match.prompt", () => ({
  buildResumeJobMatchPrompt:
    mocks.buildResumeJobMatchPrompt,
}));

vi.mock("./prompts/cover-letter.prompt", () => ({
  buildCoverLetterPrompt:
    mocks.buildCoverLetterPrompt,
}));

vi.mock("./prompts/interview-prep.prompt", () => ({
  buildInterviewPrepPrompt:
    mocks.buildInterviewPrepPrompt,
}));

import { aiService } from "./ai.service.js";

import type {
  CoverLetterParams,
  CoverLetterResult,
  GenerateInterviewPrepParams,
  InterviewPrepResult,
  JobExtractionResult,
  JobMatchParams,
  ResumeAnalysisResult,
  ResumeJobMatchResult,
} from "./ai.types.js";

type MockAIResponseOptions = {
  outputText?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
};

function createMockAIResponse({
  outputText = "{}",
  inputTokens = 100,
  outputTokens = 50,
  totalTokens = 150,
}: MockAIResponseOptions = {}) {
  return {
    output_text: outputText,

    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
    },
  };
}

describe("aiService", () => {
  const service = aiService();

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.buildResumeAnalysisPrompt.mockReturnValue(
      "resume-analysis-prompt",
    );

    mocks.buildJobExtractionPrompt.mockReturnValue(
      "job-extraction-prompt",
    );

    mocks.buildResumeJobMatchPrompt.mockReturnValue(
      "job-match-prompt",
    );

    mocks.buildCoverLetterPrompt.mockReturnValue(
      "cover-letter-prompt",
    );

    mocks.buildInterviewPrepPrompt.mockReturnValue(
      "interview-prep-prompt",
    );
  });

  describe("analyzeResume", () => {
    const resumeText =
      "Experienced software engineer with React and Node.js skills.";

    const analysisResult: ResumeAnalysisResult = {
      overallScore: 82,

      scores: {
        atsCompatibility: 84,
        formatting: 80,
        clarity: 85,
        technicalSkills: 90,
        experience: 75,
        projects: 88,
        education: 70,
        grammar: 92,
      },

      summary: "A strong software engineering resume.",
      strengths: ["Strong technical project experience"],
      weaknesses: ["Limited quantified achievements"],
      improvements: ["Add measurable outcomes"],
      missingKeywords: ["CI/CD"],
      recommendedJobTitles: [
        "Full-Stack Developer",
        "Frontend Developer",
      ],
    };

    it("builds the prompt with the resume text", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: JSON.stringify(analysisResult),
        }),
      );

      await service.analyzeResume(resumeText);

      expect(
        mocks.buildResumeAnalysisPrompt,
      ).toHaveBeenCalledOnce();

      expect(
        mocks.buildResumeAnalysisPrompt,
      ).toHaveBeenCalledWith({
        resumeText,
      });
    });

    it("sends the generated prompt and configured model to OpenAI", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: JSON.stringify(analysisResult),
        }),
      );

      await service.analyzeResume(resumeText);

      expect(mocks.createResponse).toHaveBeenCalledOnce();

      expect(mocks.createResponse).toHaveBeenCalledWith({
        model: "test-openai-model",
        input: "resume-analysis-prompt",
      });
    });

    it("returns the parsed analysis and token usage", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: JSON.stringify(analysisResult),
          inputTokens: 200,
          outputTokens: 80,
          totalTokens: 280,
        }),
      );

      const result =
        await service.analyzeResume(resumeText);

      expect(result).toEqual({
        result: analysisResult,

        usage: {
          modelUsed: "test-openai-model",
          promptTokens: 200,
          outputTokens: 80,
          totalTokens: 280,
        },
      });
    });

    it("returns undefined token values when OpenAI does not provide usage", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: JSON.stringify(analysisResult),
        usage: undefined,
      });

      const result =
        await service.analyzeResume(resumeText);

      expect(result.usage).toEqual({
        modelUsed: "test-openai-model",
        promptTokens: undefined,
        outputTokens: undefined,
        totalTokens: undefined,
      });
    });

    it("throws AI_EMPTY_RESPONSE when OpenAI returns no text", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: "",
        usage: undefined,
      });

      await expect(
        service.analyzeResume(resumeText),
      ).rejects.toMatchObject({
        message: "AI did not return a response",
        code: "AI_EMPTY_RESPONSE",
      });
    });

    it("throws AI_INVALID_JSON when OpenAI returns malformed JSON", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: "{ invalid json",
        }),
      );

      await expect(
        service.analyzeResume(resumeText),
      ).rejects.toMatchObject({
        message: "AI returned invalid JSON",
        code: "AI_INVALID_JSON",
      });
    });

    it("propagates errors thrown by the OpenAI client", async () => {
      const openAIError =
        new Error("OpenAI request failed");

      mocks.createResponse.mockRejectedValue(
        openAIError,
      );

      await expect(
        service.analyzeResume(resumeText),
      ).rejects.toBe(openAIError);
    });
  });

  describe("extractJobPostFromText", () => {
    const rawText = `
      Software Engineer
      Xuris Ltd
      London
      Build React and Node.js applications.
    `;

    const extractionResult: JobExtractionResult = {
      title: "Software Engineer",
      company: "Xuris Ltd",
      location: "London",
      salary: null,
      description:
        "Build React and Node.js applications.",
      requirements: [
        "React",
        "Node.js",
        "TypeScript",
      ],
      responsibilities: [
        "Build and maintain web applications",
      ],
    };

    it("builds the extraction prompt with the raw job text", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(extractionResult),
        }),
      );

      await service.extractJobPostFromText(
        rawText,
      );

      expect(
        mocks.buildJobExtractionPrompt,
      ).toHaveBeenCalledWith({
        rawText,
      });
    });

    it("sends the extraction prompt to OpenAI", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(extractionResult),
        }),
      );

      await service.extractJobPostFromText(
        rawText,
      );

      expect(mocks.createResponse).toHaveBeenCalledWith({
        model: "test-openai-model",
        input: "job-extraction-prompt",
      });
    });

    it("returns the parsed job extraction result", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(extractionResult),
        }),
      );

      const result =
        await service.extractJobPostFromText(
          rawText,
        );

      expect(result).toEqual(extractionResult);
    });

    it("throws AI_EMPTY_RESPONSE when extraction returns no text", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: null,
        usage: undefined,
      });

      await expect(
        service.extractJobPostFromText(rawText),
      ).rejects.toMatchObject({
        message: "AI did not return a response",
        code: "AI_EMPTY_RESPONSE",
      });
    });

    it("throws AI_INVALID_JSON when extraction returns malformed JSON", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: "not-json",
        }),
      );

      await expect(
        service.extractJobPostFromText(rawText),
      ).rejects.toMatchObject({
        message: "AI returned invalid JSON",
        code: "AI_INVALID_JSON",
      });
    });
  });

  describe("matchResumeToJob", () => {
    const params: JobMatchParams = {
      resumeText:
        "Full-stack developer with React and Node.js experience.",
      jobTitle: "Full-Stack Developer",
      company: "Xuris Ltd",
      jobDescription:
        "Build and maintain SaaS applications.",
      requirements: [
        "React",
        "Node.js",
        "PostgreSQL",
      ],
      responsibilities: [
        "Develop frontend and backend features",
      ],
    };

    const matchResult: ResumeJobMatchResult = {
      matchScore: 86,
      summary:
        "The resume is a strong match for the position.",
      matchingStrengths: [
        "React experience",
        "Node.js experience",
      ],
      missingRequirements: [
        "Commercial AWS experience",
      ],
      missingKeywords: ["AWS"],
      recommendedResumeChanges: [
        "Highlight cloud deployment experience",
      ],
      riskAreas: [
        "Limited commercial experience",
      ],
      interviewFocusAreas: [
        "System design",
        "Cloud infrastructure",
      ],
    };

    it("builds the job-match prompt using all parameters", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: JSON.stringify(matchResult),
        }),
      );

      await service.matchResumeToJob(params);

      expect(
        mocks.buildResumeJobMatchPrompt,
      ).toHaveBeenCalledWith(params);
    });

    it("returns the match result and usage", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: JSON.stringify(matchResult),
          inputTokens: 350,
          outputTokens: 120,
          totalTokens: 470,
        }),
      );

      const result =
        await service.matchResumeToJob(params);

      expect(result).toEqual({
        result: matchResult,

        usage: {
          modelUsed: "test-openai-model",
          promptTokens: 350,
          outputTokens: 120,
          totalTokens: 470,
        },
      });
    });

    it("throws AI_EMPTY_RESPONSE when job matching returns no text", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: undefined,
        usage: undefined,
      });

      await expect(
        service.matchResumeToJob(params),
      ).rejects.toMatchObject({
        message: "AI did not return a response",
        code: "AI_EMPTY_RESPONSE",
      });
    });

    it("throws AI_INVALID_JSON when job matching returns malformed JSON", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: '{"matchScore":',
        }),
      );

      await expect(
        service.matchResumeToJob(params),
      ).rejects.toMatchObject({
        message: "AI returned invalid JSON",
        code: "AI_INVALID_JSON",
      });
    });
  });

  describe("generateCoverLetter", () => {
    const params: CoverLetterParams = {
      resumeText:
        "Full-stack developer with SaaS project experience.",
      jobTitle: "Software Engineer",
      company: "Xuris Ltd",
      jobDescription:
        "Develop customer-facing SaaS features.",
      requirements: [
        "React",
        "TypeScript",
        "Node.js",
      ],
      responsibilities: [
        "Deliver full-stack product features",
      ],
    };

    const coverLetterResult: CoverLetterResult = {
      title:
        "Application for Software Engineer",
      content:
        "Dear Hiring Manager, I am applying for the Software Engineer position...",
      tone: "Professional",
      keyPoints: [
        "Full-stack experience",
        "SaaS product development",
      ],
    };

    it("builds the cover-letter prompt with the supplied parameters", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(coverLetterResult),
        }),
      );

      await service.generateCoverLetter(params);

      expect(
        mocks.buildCoverLetterPrompt,
      ).toHaveBeenCalledWith(params);
    });

    it("returns the generated cover letter and usage", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(coverLetterResult),
          inputTokens: 400,
          outputTokens: 250,
          totalTokens: 650,
        }),
      );

      const result =
        await service.generateCoverLetter(params);

      expect(result).toEqual({
        result: coverLetterResult,

        usage: {
          modelUsed: "test-openai-model",
          promptTokens: 400,
          outputTokens: 250,
          totalTokens: 650,
        },
      });
    });

    it("throws AI_EMPTY_RESPONSE when cover-letter generation returns no text", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: "",
        usage: undefined,
      });

      await expect(
        service.generateCoverLetter(params),
      ).rejects.toMatchObject({
        message: "AI did not return a response",
        code: "AI_EMPTY_RESPONSE",
      });
    });

    it("throws AI_INVALID_JSON when cover-letter generation returns malformed JSON", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: "Dear Hiring Manager...",
        }),
      );

      await expect(
        service.generateCoverLetter(params),
      ).rejects.toMatchObject({
        message: "AI returned invalid JSON",
        code: "AI_INVALID_JSON",
      });
    });
  });

  describe("generateInterviewPrep", () => {
    const params: GenerateInterviewPrepParams = {
      resumeText:
        "Full-stack engineer with React and Express experience.",
      jobTitle: "Software Engineer",
      company: "Xuris Ltd",
      jobDescription:
        "Build scalable web applications.",
      requirements: [
        "React",
        "Node.js",
        "PostgreSQL",
      ],
      responsibilities: [
        "Design and implement product features",
      ],
      jobMatchSummary:
        "The candidate is a strong match.",
      jobMatchWeaknesses: [
        "Limited cloud experience",
      ],
      jobMatchMissingKeywords: [
        "AWS",
        "Terraform",
      ],
    };

    const interviewPrepResult: InterviewPrepResult = {
      difficulty: "INTERMEDIATE",
      summary:
        "Prepare for questions covering React, Node.js, databases, and collaboration.",

      technicalQuestions: [
        {
          question:
            "How would you structure a scalable Express application?",
          reason:
            "The role requires backend architecture experience.",
          suggestedAnswer:
            "I would separate controllers, services, repositories, middleware, and validation.",
        },
      ],

      behaviouralQuestions: [
        {
          question:
            "Tell me about a difficult technical problem you solved.",
          reason:
            "The interviewer wants evidence of problem solving.",
          suggestedAnswer:
            "Use the STAR structure and explain the measurable result.",
        },
      ],

      roleSpecificQuestions: [
        {
          question:
            "How would you improve the reliability of a SaaS application?",
          reason:
            "Reliability is important for this role.",
          suggestedAnswer:
            "Discuss testing, monitoring, retries, error handling, and observability.",
        },
      ],

      weaknessAreas: [
        "Cloud infrastructure",
      ],

      questionsToAsk: [
        "How does the team measure engineering success?",
      ],

      tips: [
        "Use examples from completed projects",
        "Explain technical trade-offs",
      ],
    };

    it("builds the interview-prep prompt with the supplied parameters", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(interviewPrepResult),
        }),
      );

      await service.generateInterviewPrep(params);

      expect(
        mocks.buildInterviewPrepPrompt,
      ).toHaveBeenCalledWith(params);
    });

    it("returns the generated interview preparation and usage", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText:
            JSON.stringify(interviewPrepResult),
          inputTokens: 500,
          outputTokens: 300,
          totalTokens: 800,
        }),
      );

      const result =
        await service.generateInterviewPrep(params);

      expect(result).toEqual({
        result: interviewPrepResult,

        usage: {
          modelUsed: "test-openai-model",
          promptTokens: 500,
          outputTokens: 300,
          totalTokens: 800,
        },
      });
    });

    it("throws AI_EMPTY_RESPONSE when interview preparation returns no text", async () => {
      mocks.createResponse.mockResolvedValue({
        output_text: null,
        usage: undefined,
      });

      await expect(
        service.generateInterviewPrep(params),
      ).rejects.toMatchObject({
        message: "AI did not return a response",
        code: "AI_EMPTY_RESPONSE",
      });
    });

    it("throws AI_INVALID_JSON when interview preparation returns malformed JSON", async () => {
      mocks.createResponse.mockResolvedValue(
        createMockAIResponse({
          outputText: "invalid-response",
        }),
      );

      await expect(
        service.generateInterviewPrep(params),
      ).rejects.toMatchObject({
        message: "AI returned invalid JSON",
        code: "AI_INVALID_JSON",
      });
    });
  });
});