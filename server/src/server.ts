import express from 'express';
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

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use('/api', setRateLimit)
app.get("/health", healthCheck)

app.use(notFoundHandler);
app.use(errorHandler);

let server: Server | undefined;
(async () => {
    try {
        await database().connect();
        console.log("Connecting to the server...")
        server = app.listen(env.PORT, () => {
            console.log(`Server running on http://localhost:${env.PORT}`)
        })
    } catch (error: unknown) {
        console.log(`There was an error connecting to the server: ${error}`)
        await database().disconnect();
    }
})();

function shutdown(signal: string) {
    console.log((`${signal} received. Shutting down server...`))

    if (server) {
        server.close(() => {
            console.log("HTTP server closed")
            process.exit(1);
        });

    } else {
        process.exit(1);
    }

    setTimeout(() => {
        console.error("Forced shutdown.");
        process.exit(1)
    }, 10_000)
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
