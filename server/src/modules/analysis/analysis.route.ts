import express from 'express';
import { analysisController } from './analysis.controller';
import { requireUser } from '../../middleware/auth';

const router = express.Router();
const controller = analysisController();

router.post('/resumes/:resumeId/analyse', requireUser, controller.analyseResume);
router.post('/job-match', requireUser, controller.createJobMatchAnalysis)

router.get('/resumes/:resumeId/analyses', requireUser, controller.getResumeAnalyses);
router.get('/:analysisId', requireUser, controller.getAnalysisById);
router.get('/jobs/:jobPostId/matches', requireUser, controller.getJobMatchAnalysisByJobPostId);
router.get('/resumes/:resumeId/job-matches', requireUser, controller.getJobMatchAnalysisByResumeId);

export default router;