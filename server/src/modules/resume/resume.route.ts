import express from 'express';
import { upload } from "../../middleware/upload.js";
import { resumeController } from "./resume.controller.js";
import { requireUser } from '../../middleware/auth.js';

const controller = resumeController()
const router = express.Router();

router.post('/upload', requireUser, upload.single('resume'), controller.uploadResume)
router.get('/:id', requireUser, controller.getResumeById);
router.get('/', requireUser, controller.getCurrentUserResumes);
router.delete('/:id', requireUser, controller.deleteResume);

export default router;