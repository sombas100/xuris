import { successResponse } from "../../utils/api-response";
import { asyncHandler } from "../../middleware/async-handler";

import { coverLetterService } from "./cover-letter.service";

const service = coverLetterService();

export const coverLetterController = () => {
  const generateCoverLetter = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;

      const result =
        await service.createTailoredCoverLetter(
          req.body,
          userId,
        );

      return successResponse(res, result, 201);
    },
  );

  const getCoverLetterById = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const coverLetterId = String(
        req.params.coverLetterId,
      );

      const result =
        await service.getCoverLetterById(
          coverLetterId,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const getCoverLettersByResumeAndJob =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;
      const resumeId = String(req.params.resumeId);
      const jobPostId = String(req.params.jobPostId);

      const results =
        await service.getCoverLettersByResumeAndJob(
          resumeId,
          jobPostId,
          userId,
        );

      return successResponse(res, results, 200);
    });

  return {
    generateCoverLetter,
    getCoverLetterById,
    getCoverLettersByResumeAndJob,
  };
};