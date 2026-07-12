import { asyncHandler } from "../../middleware/async-handler";
import { HttpError } from "../../errors/HttpError";
import { successResponse } from "../../utils/api-response";
import { resumeService as createResumeService } from "./resume.service";

const resumeService = createResumeService();

export const resumeController = () => {
  const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new HttpError("Resume file is required", 400, "FILE_REQUIRED");
    }

    
    const userId = req.user!.id;

    const result = await resumeService.uploadResume(req.file, userId);
    
    return successResponse(res, result, 201);
  });

  const getCurrentUserResumes = asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const results = await resumeService.getAllResumes(userId);

    return successResponse(res, results, 200);
  })

  const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resumeId = String(id)
    const userId = req.user!.id

    const result = await resumeService.getResume(resumeId, userId);

    return successResponse(res, result, 200);
  });

  const deleteResume = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resumeId = String(id);
    const userId = req.user!.id

    const result = await resumeService.deleteResume(resumeId, userId);

    return successResponse(res, result, 204);
  })

  return {
    uploadResume,
    getResumeById,
    getCurrentUserResumes,
    deleteResume,
  };
};