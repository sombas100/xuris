import type { Server } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { database } from "./config/db.js";

const db = database();

let server: Server | undefined;

async function startServer() {
  try {
    await db.connect();

    console.log("Connected to the database");

    server = app.listen(
      env.PORT,
      () => {
        console.log(
          `Server running on http://localhost:${env.PORT}`,
        );
      },
    );
  } catch (error: unknown) {
    console.error(
      "There was an error starting the server:",
      error,
    );

    await db.disconnect();
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  console.log(
    `${signal} received. Shutting down server...`,
  );

  if (!server) {
    await db.disconnect();
    process.exit(0);
  }

  server.close(async () => {
    console.log("HTTP server closed");

    await db.disconnect();

    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown.");
    process.exit(1);
  }, 10_000).unref();
}

void startServer();

process.on(
  "SIGTERM",
  () => void shutdown("SIGTERM"),
);

process.on(
  "SIGINT",
  () => void shutdown("SIGINT"),
);