import express from "express";

import {
  requireUser,
} from "../../middleware/auth.js";

import {
  usageController,
} from "./usage.controller.js";

const router = express.Router();
const controller = usageController();

router.get(
  "/summary",
  requireUser,
  controller.getUsageSummary,
);

export default router;