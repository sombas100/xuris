import express from "express";
import { requireUser } from "../../middleware/auth.js";
import { authController } from "./auth.controller.js";

const router = express.Router();
const controller = authController();

router.get("/me", requireUser, controller.getCurrentUser);

export default router;