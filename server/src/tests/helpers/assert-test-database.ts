export function assertTestDatabase() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Tests must run with NODE_ENV=test.",
    );
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing in the test environment.",
    );
  }

  const isTestDatabase =
    databaseUrl.includes("xuris_test");

  if (!isTestDatabase) {
    throw new Error(
      [
        "Unsafe test database configuration.",
        "DATABASE_URL must reference xuris_test.",
        `Received: ${databaseUrl}`,
      ].join(" "),
    );
  }
}