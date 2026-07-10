import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";
import { jobService } from "./job.service";

const service = jobService();

export const jobController = () => {
    const createJobPost = asyncHandler(async (req, res) => {
        const userId = req.user!.id;        
        const createdJob = await service.createJobPost(req.body, userId)

        return successResponse(res, createdJob, 201);
    })

    const createJobPostFromText = asyncHandler(async (req, res) => {
        const userId = req.user!.id;

        const extractedJob = await service.createJobPostFromText(req.body, userId);

        return successResponse(res, extractedJob, 201)
    })


    return { createJobPost, createJobPostFromText }
}