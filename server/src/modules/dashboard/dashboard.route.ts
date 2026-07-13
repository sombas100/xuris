import express from "express";

import { requireUser } from "../../middleware/auth";
import { dashboardController } from "./dashboard.controller";

const router = express.Router();
const controller = dashboardController();

router.get(
  "/summary",
  requireUser,
  controller.getSummary,
);

export default router;