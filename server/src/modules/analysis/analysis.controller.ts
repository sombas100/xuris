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

    const getAnalysisById = asyncHandler(async (req, res) => {
        const analysisId = String(req.params.analysisId);

        const  result = await analysisService.getAnalysisById(analysisId);

        return successResponse(res, result, 200)
    })

    const getResumeAnalyses = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId);

        const result = await analysisService.getResumeAnalyses(resumeId);

        return successResponse(res, result, 200);
    })

    return { analyseResume, getAnalysisById, getResumeAnalyses }
}