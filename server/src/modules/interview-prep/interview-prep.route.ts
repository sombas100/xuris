import express from 'express';
import { interviewPrepController } from './interview-prep.controller';
import { requireUser } from '../../middleware/auth';

const router = express.Router();
const controller = interviewPrepController();


router.post('/', requireUser, controller.generateInterviewPrep);

export default router