import {
  describe,
  expect,
  it,
} from "vitest";

import { prisma } from "../../lib/prisma";

describe("test database", () => {
  it("connects to the isolated test database", async () => {
    const result = await prisma.$queryRaw<
      Array<{
        database_name: string;
      }>
    >`
      SELECT current_database() AS database_name
    `;

    expect(result).toHaveLength(1);

    expect(
      result[0]?.database_name,
    ).toBe("xuris_test");
  });
});