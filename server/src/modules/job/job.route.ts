import express from 'express';
import { jobController } from './job.controller';

const router = express.Router();
const controller = jobController();

router.post('/from-text', controller.createJobPost);


export default router;