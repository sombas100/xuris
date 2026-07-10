import express from "express";
import { requireUser } from "../../middleware/auth";
import { authController } from "./auth.controller";

const router = express.Router();
const controller = authController();

router.get("/me", requireUser, controller.getCurrentUser);

export default router;