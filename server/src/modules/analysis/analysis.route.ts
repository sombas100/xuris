import express from 'express';
import { analysisController } from './analysis.controller';

const router = express.Router();
const controller = analysisController();

router.post('/resumes/:resumeId/analyse', controller.analyseResume);
router.post('/job-match', controller.createJobMatchAnalysis)

router.get('/resumes/:resumeId/analyses', controller.getResumeAnalyses);
router.get('/:analysisId', controller.getAnalysisById);
router.get('/jobs/:jobPostId/matches', controller.getJobMatchAnalysisByJobPostId);
router.get('/resumes/:resumeId/job-matches', controller.getJobMatchAnalysisByResumeId);

export default router;