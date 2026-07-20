import express from "express";

import { coverLetterController } from "./cover-letter.controller.js";
import { requireUser } from "../../middleware/auth.js";

const router = express.Router();
const controller = coverLetterController();

router.post(
  "/",
  requireUser,
  controller.generateCoverLetter,
);

router.get(
  "/resumes/:resumeId/jobs/:jobPostId",
  requireUser,
  controller.getCoverLettersByResumeAndJob,
);

router.get(
  "/:coverLetterId",
  requireUser,
  controller.getCoverLetterById,
);

export default router;