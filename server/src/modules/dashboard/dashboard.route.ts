import express from "express";

import { requireUser } from "../../middleware/auth.js";
import { dashboardController } from "./dashboard.controller.js";

const router = express.Router();
const controller = dashboardController();

router.get(
  "/summary",
  requireUser,
  controller.getSummary,
);

export default router;