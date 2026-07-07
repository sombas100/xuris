import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";
import { jobService } from "./job.service";

const service = jobService();

export const jobController = () => {
    const createJobPost = asyncHandler(async (req, res) => {
        const userId = "4vtstgervxdgvtxdfg";
        
        const createdJob = await service.createJobPost(req.body, userId)

        return successResponse(res, createdJob, 201);
    })


    return { createJobPost }
}