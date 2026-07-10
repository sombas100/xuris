import express from 'express';
import { jobController } from './job.controller';
import { requireUser } from '../../middleware/auth';

const router = express.Router();
const controller = jobController();

router.post('/', requireUser, controller.createJobPost);
router.post('/from-text', requireUser, controller.createJobPostFromText);


export default router;