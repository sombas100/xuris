import express from 'express';
import { upload } from "../../middleware/upload";
import { resumeController } from "./resume.controller";

const controller = resumeController()
const router = express.Router();

router.post('/v1/upload', upload.single('resume'), controller.uploadResume)


export default router;