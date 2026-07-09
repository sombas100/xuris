import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";
import { interviewPrepService } from "./interview-prep.service";

const service = interviewPrepService();


export const interviewPrepController = () => {
    const generateInterviewPrep = asyncHandler(async (req, res) => {
            const userId = "4vtstgervxdgvtxdfg";
            const { resumeId, jobPostId } = req.body

            const result = await service.createInterviewPrep({
                userId,
                resumeId,
                jobPostId,
            })

            return successResponse(res, result, 201)
    })

    return { generateInterviewPrep }
}