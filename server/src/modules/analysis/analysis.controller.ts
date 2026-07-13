import { analysisService as createAnalysisService } from "./analysis.service";
import { asyncHandler } from "../../middleware/async-handler";
import { successResponse } from "../../utils/api-response";

const analysisService = createAnalysisService();

export const analysisController = () => {
    const createJobMatchAnalysis = asyncHandler(async (req, res) => {
        const userId = req.user!.id;
        const { resumeId, jobPostId } = req.body;
        const result = await analysisService.createJobMatchAnalysis({
            userId,
            resumeId,
            jobPostId,
        })

        return successResponse(res, result, 201);
    })

    const analyseResume = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId)
        
        const userId = req.user!.id;

        const result = await analysisService.analyseResume(resumeId, userId);

        return successResponse(res, result, 201)
    })

    const getAnalysisById = asyncHandler(async (req, res) => {
        const analysisId = String(req.params.analysisId);
        const userId = req.user!.id;

        const  result = await analysisService.getAnalysisById(analysisId, userId);

        return successResponse(res, result, 200)
    })

    const getResumeAnalyses = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId);
        const userId = req.user!.id;

        const result = await analysisService.getResumeAnalyses(resumeId, userId);

        return successResponse(res, result, 200);
    })

    const getJobMatchAnalysisByJobPostId = asyncHandler(async (req, res) => {
        const jobPostId = String(req.params.jobPostId);
        const userId = req.user!.id;

        const result = await analysisService.getJobMatchAnalysisByJobId(jobPostId, userId);

        return successResponse(res, result, 200);
    })

    const getJobMatchAnalysisByResumeId = asyncHandler(async (req, res) => {
        const resumeId = String(req.params.resumeId);
        const userId = req.user!.id;

        const result = await analysisService.getJobMatchAnalysisByResumeId(resumeId, userId);

        return successResponse(res, result, 200);
    })

    return { 
        createJobMatchAnalysis, 
        analyseResume, 
        getAnalysisById, 
        getResumeAnalyses,
        getJobMatchAnalysisByJobPostId,
        getJobMatchAnalysisByResumeId,
    }
}