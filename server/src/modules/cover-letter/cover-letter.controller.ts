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

    return { generateCoverLetter }
}