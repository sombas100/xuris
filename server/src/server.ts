import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from './config/env.js';
import { database } from './config/db.js';
import type { Server } from 'node:http';
import healthCheck from './routes/health-route.js';
import { setRateLimit } from './utils/rate-limit.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/notFound-handler.js';

import resumeRoutes from './modules/resume/resume.route.js';
import analysisRoutes from './modules/analysis/analysis.route.js';
import jobRoutes from './modules/job/job.route.js';
import coverLetterRoutes from './modules/cover-letter/cover-letter.route.js';
import interviewPrepRoutes from './modules/interview-prep/interview-prep.route.js';
import authRoutes from './modules/auth/user.route.js';
import dashboardRoutes from './modules/dashboard/dashboard.route.js';
import applicationRoutes from './modules/application/application.route.js'
import { stripeWebhookHandler,} from "./modules/billing/stripe-webhook.controller.js";
import billingRoutes from "./modules/billing/billing.route.js";
import usageRoute from './modules/usage/usage.route.js';


const app = express();
const db = database();

app.set('trust proxy', 1);
app.use(helmet());
app.get("/health", healthCheck)
app.post("/api/billing/v1/webhook",
  express.raw({ type: "application/json", }), stripeWebhookHandler);
app.use(clerkMiddleware());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use('/api', setRateLimit)
app.use('/api/resumes/v1', resumeRoutes);
app.use('/api/analysis/v1', analysisRoutes);
app.use('/api/jobs/v1', jobRoutes);
app.use('/api/cover-letters/v1', coverLetterRoutes);
app.use('/api/interview-prep/v1', interviewPrepRoutes);
app.use('/api/auth/v1', authRoutes);
app.use('/api/dashboard/v1', dashboardRoutes);
app.use('/api/applications/v1', applicationRoutes)
app.use("/api/billing/v1", billingRoutes);
app.use('/api/usage/v1', usageRoute)



app.use(notFoundHandler);
app.use(errorHandler);

let server: Server | undefined;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  try {
    console.log("Connecting to the database...");

    await db.connect();

    console.log("Database connected");

    server = app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start the server:", error);

    await db.disconnect().catch((disconnectError: unknown) => {
      console.error(
        "Failed to disconnect from the database:",
        disconnectError,
      );
    });

    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down server...`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Forced shutdown after 10 seconds.");
    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error?: Error) => {
          if (error) {
            reject(error);
            return;
          }

          console.log("HTTP server closed");
          resolve();
        });
      });
    }

    await db.disconnect();

    console.log("Database disconnected");

    clearTimeout(forceShutdownTimer);
    process.exit(0);
  } catch (error: unknown) {
    console.error("Error during shutdown:", error);

    clearTimeout(forceShutdownTimer);
    process.exit(1);
  }
}

void startServer();

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});