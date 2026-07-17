import {
  afterAll,
  afterEach,
  beforeAll,
} from "vitest";

import { prisma } from "../lib/prisma";

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(() => {
  
});

afterAll(async () => {
  await prisma.$disconnect();
});