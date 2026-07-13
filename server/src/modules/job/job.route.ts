import express from "express";

import { jobController } from "./job.controller";
import { requireUser } from "../../middleware/auth";

const router = express.Router();
const controller = jobController();

router.post("/from-text", requireUser, controller.createJobPostFromText);

router.get("/", requireUser, controller.getCurrentUserJobPosts);

router.get("/:jobPostId", requireUser, controller.getJobPostById);

export default router;