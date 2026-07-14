import express from "express";

import { requireUser } from "../../middleware/auth";
import { applicationController } from "./application.controller";

const router = express.Router();
const controller = applicationController();

router.post("/", requireUser, controller.createApplication);

router.get("/", requireUser, controller.getApplications);

router.get("/:applicationId", requireUser, controller.getApplicationById);

router.patch("/:applicationId", requireUser, controller.updateApplication);

router.patch("/:applicationId/status", requireUser, controller.updateApplicationStatus);

router.delete("/:applicationId", requireUser, controller.deleteApplication);

export default router;