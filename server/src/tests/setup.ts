import { afterAll, beforeAll } from "vitest";

import { prisma } from "../lib/prisma";
import { assertTestDatabase } from "./helpers/assert-test-database";

beforeAll(async () => {
  assertTestDatabase();

  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});