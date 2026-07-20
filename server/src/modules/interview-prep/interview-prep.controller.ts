import { asyncHandler } from "../../middleware/async-handler.js";
import { successResponse } from "../../utils/api-response.js";
import { interviewPrepService } from "./interview-prep.service.js";

const service = interviewPrepService();


export const interviewPrepController = () => {
  const generateInterviewPrep = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const { resumeId, jobPostId } = req.body;

      const result =
        await service.createInterviewPrep({
          userId,
          resumeId,
          jobPostId,
        });

      return successResponse(res, result, 201);
    },
  );

  const getInterviewPrepById = asyncHandler(
    async (req, res) => {
      const userId = req.user!.id;
      const interviewPrepId = String(
        req.params.interviewPrepId,
      );

      const result =
        await service.getInterviewPrepById(
          interviewPrepId,
          userId,
        );

      return successResponse(res, result, 200);
    },
  );

  const getInterviewPrepsByResumeAndJob =
    asyncHandler(async (req, res) => {
      const userId = req.user!.id;
      const resumeId = String(req.params.resumeId);
      const jobPostId = String(req.params.jobPostId);

      const results =
        await service.getInterviewPrepsByResumeAndJob(
          resumeId,
          jobPostId,
          userId,
        );

      return successResponse(res, results, 200);
    });

  return {
    generateInterviewPrep,
    getInterviewPrepById,
    getInterviewPrepsByResumeAndJob,
  };
};