import express from 'express';
import { jobController } from './job.controller';

const router = express.Router();
const controller = jobController();

router.post('/', controller.createJobPost);
router.post('/from-text', controller.createJobPostFromText);


export default router;