import express from 'express';
import { upload } from "../../middleware/upload";
import { resumeController } from "./resume.controller";

const controller = resumeController()
const router = express.Router();

router.post('/v1/upload', upload.single('resume'), controller.uploadResume)
router.get('/v1/:id', controller.getResumeById);
router.get('/v1', controller.getCurrentUserResumes);
router.delete('/v1/:id', controller.deleteResume);

export default router;