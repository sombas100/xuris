import express from "express";

import { interviewPrepController } from "./interview-prep.controller";
import { requireUser } from "../../middleware/auth";

const router = express.Router();
const controller = interviewPrepController();

router.post("/", requireUser, controller.generateInterviewPrep,);

router.get("/resumes/:resumeId/jobs/:jobPostId", requireUser, controller.getInterviewPrepsByResumeAndJob,);

router.get("/:interviewPrepId", requireUser, controller.getInterviewPrepById);

export default router;