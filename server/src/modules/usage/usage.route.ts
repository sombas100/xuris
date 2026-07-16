import express from "express";

import {
  requireUser,
} from "../../middleware/auth";

import {
  usageController,
} from "./usage.controller";

const router = express.Router();
const controller = usageController();

router.get(
  "/summary",
  requireUser,
  controller.getUsageSummary,
);

export default router;