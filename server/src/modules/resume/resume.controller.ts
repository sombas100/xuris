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

    
    const userId = "4vtstgervxdgvtxdfg";

    const result = await resumeService.uploadResume(req.file, userId);
    
    return successResponse(res, result, 201);
  });

  const getCurrentUserResumes = asyncHandler(async (req, res) => {
    const userId = "4vtstgervxdgvtxdfg";

    const results = await resumeService.getAllResumes(userId);

    return successResponse(res, results, 200);
  })

  const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resumeId = String(id)

    const result = await resumeService.getResume(resumeId);

    return successResponse(res, result, 200);
  });

  return {
    uploadResume,
    getResumeById,
    getCurrentUserResumes,
  };
};