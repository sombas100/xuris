import { asyncHandler } from "../../middleware/async-handler.js";
import { successResponse } from "../../utils/api-response.js";
import { jobService } from "./job.service.js";

const service = jobService();

export const jobController = () => {
  const createJobPostFromText = asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const extractedJob = await service.createJobPostFromText(
      req.body,
      userId,
    );

    return successResponse(res, extractedJob, 201);
  });

  const getCurrentUserJobPosts = asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const jobPosts =
      await service.getCurrentUserJobPosts(userId);

    return successResponse(res, jobPosts, 200);
  });

  const getJobPostById = asyncHandler(async (req, res) => {
    const userId = req.user!.id;
    const jobPostId = String(req.params.jobPostId);

    const jobPost = await service.getJobPost(
      jobPostId,
      userId,
    );

    return successResponse(res, jobPost, 200);
  });

  return {
    createJobPostFromText,
    getCurrentUserJobPosts,
    getJobPostById,
  };
};