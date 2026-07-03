import express from 'express';
import { upload } from "../../middleware/upload";
import { resumeController } from "./resume.controller";

const controller = resumeController()
const router = express.Router();

router.post('/resumes/upload', upload.single('resume'), controller.uploadResume)
router.post('resumes',)

export default router;