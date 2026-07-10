import express from 'express';
import { upload } from "../../middleware/upload";
import { resumeController } from "./resume.controller";
import { requireUser } from '../../middleware/auth';

const controller = resumeController()
const router = express.Router();

router.post('/upload', requireUser, upload.single('resume'), controller.uploadResume)
router.get('/:id', controller.getResumeById);
router.get('/', requireUser, controller.getCurrentUserResumes);
router.delete('/:id', controller.deleteResume);

export default router;