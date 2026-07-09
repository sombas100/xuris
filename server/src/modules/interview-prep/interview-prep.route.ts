import express from 'express';
import { interviewPrepController } from './interview-prep.controller';

const router = express.Router();
const controller = interviewPrepController();


router.post('/', controller.generateInterviewPrep);

export default router