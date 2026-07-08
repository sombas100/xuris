import { successResponse } from "../../utils/api-response";
import { asyncHandler } from "../../middleware/async-handler";
import { coverLetterService } from "./cover-letter.service";

const service = coverLetterService();

export const coverLetterController = () => {
    const generateCoverLetter = asyncHandler(async (req, res) => {
        const userId = "4vtstgervxdgvtxdfg";

        const result = await service.createTailoredCoverLetter(req.body, userId);

        return successResponse(res, result, 201);
    })

    const getCoverLetterById = asyncHandler(async (req, res) => {
        const id = String(req.params.id);
        const result = await service.getCoverLetterById(id);

        return successResponse(res, result, 200);
    })

    const getCoverLettersByResumeId = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId);
        const result = await service.getCoverLettersByResumeId(resumeId);
        
        return successResponse(res, result, 200);
    })

    const getCoverLettersByJobPostId = asyncHandler(async (req, res) => {
        const jobPostId = String(req.params.jobPostId);
        const result = await service.getCoverLettersByJobPostId(jobPostId);
        
        return successResponse(res, result, 200);
    })

    

    return { 
        generateCoverLetter, 
        getCoverLetterById,
        getCoverLettersByResumeId,
        getCoverLettersByJobPostId
    }
}