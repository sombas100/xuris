import { analysisService as createAnalysisService } from "./analysis.service";
import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

const analysisService = createAnalysisService();

export const analysisController = () => {
    const analyseResume = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId)
        

        const userId = "4vtstgervxdgvtxdfg";

        const result = await analysisService.analyseResume(resumeId, userId);

        return successResponse(res, result, 201)
    })

    return { analyseResume }
}