import express from 'express';
import { upload } from "../../middleware/upload";
import { resumeController } from "./resume.controller";

const controller = resumeController()
const router = express.Router();

router.post('/upload', upload.single('resume'), controller.uploadResume)
router.get('/:id', controller.getResumeById);
router.get('/', controller.getCurrentUserResumes);
router.delete('/:id', controller.deleteResume);

export default router;