import express from 'express';
import { analysisController } from './analysis.controller';

const router = express.Router();
const controller = analysisController();

router.post('/resumes/:resumeId/analyse', controller.analyseResume);

export default router;