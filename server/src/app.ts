import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { env } from "./config/env.js";

import healthCheck from "./routes/health-route.js";

import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/notFound-handler.js";

import resumeRoutes from "./modules/resume/resume.route.js";
import analysisRoutes from "./modules/analysis/analysis.route.js";
import jobRoutes from "./modules/job/job.route.js";
import coverLetterRoutes from "./modules/cover-letter/cover-letter.route.js";
import interviewPrepRoutes from "./modules/interview-prep/interview-prep.route.js";
import authRoutes from "./modules/auth/user.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import applicationRoutes from "./modules/application/application.route.js";
import billingRoutes from "./modules/billing/billing.route.js";
import usageRoutes from "./modules/usage/usage.route.js";

import {
  stripeWebhookHandler,
} from "./modules/billing/stripe-webhook.controller.js";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

/*
 * Stripe needs the untouched raw body.
 * This route must remain before express.json().
 */
app.post(
  "/api/billing/v1/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhookHandler,
);

app.use(clerkMiddleware());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(compression());

if (env.NODE_ENV !== "test") {
  app.use(
    morgan(
      env.NODE_ENV === "production"
        ? "combined"
        : "dev",
    ),
  );
}

app.use(
  "/api/resumes/v1",
  resumeRoutes,
);

app.use(
  "/api/analysis/v1",
  analysisRoutes,
);

app.use(
  "/api/jobs/v1",
  jobRoutes,
);

app.use(
  "/api/cover-letters/v1",
  coverLetterRoutes,
);

app.use(
  "/api/interview-prep/v1",
  interviewPrepRoutes,
);

app.use(
  "/api/auth/v1",
  authRoutes,
);

app.use(
  "/api/dashboard/v1",
  dashboardRoutes,
);

app.use(
  "/api/applications/v1",
  applicationRoutes,
);

app.use(
  "/api/billing/v1",
  billingRoutes,
);

app.use(
  "/api/usage/v1",
  usageRoutes,
);

app.get("/health", healthCheck);

app.use(notFoundHandler);
app.use(errorHandler);