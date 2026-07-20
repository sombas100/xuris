import express from "express";

import { requireUser } from "../../middleware/auth.js";

import {
  billingController,
} from "./billing.controller.js";

const router = express.Router();
const controller = billingController();

router.post(
  "/checkout",
  requireUser,
  controller.createCheckoutSession,
);

router.post(
  "/portal",
  requireUser,
  controller.createPortalSession,
);

router.get(
  "/status",
  requireUser,
  controller.getBillingStatus,
);

export default router;