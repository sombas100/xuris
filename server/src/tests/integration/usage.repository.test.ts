import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  Plan,
  UsageType,
} from "../../generated/prisma/enums.js";

import { prisma } from "../../lib/prisma.js";
import {
  usageRepository,
} from "../../modules/usage/usage.repository.js";

const repository = usageRepository();

const testUserIds: string[] = [];

function getTestUsageType(): UsageType {
  const usageType =
    Object.values(UsageType)[0];

  if (!usageType) {
    throw new Error(
      "The UsageType enum contains no values.",
    );
  }

  return usageType;
}

async function createTestUser(
  overrides: Partial<{
    plan: Plan;
    monthlyUsageLimit: number;
    monthlyUsageCount: number;
    usageResetDate: Date | null;
  }> = {},
) {
  const uniqueValue = crypto.randomUUID();

  const user = await prisma.user.create({
    data: {
      clerkId: `clerk_test_${uniqueValue}`,
      email: `usage-${uniqueValue}@xuris.test`,

      plan: Plan.FREE,

      monthlyUsageLimit: 5,
      monthlyUsageCount: 0,

      usageResetDate: new Date(
        "2026-08-01T00:00:00.000Z",
      ),

      ...overrides,
    },
  });

  testUserIds.push(user.id);

  return user;
}

async function cleanTestRecords() {
  if (testUserIds.length === 0) {
    return;
  }

  await prisma.usageEvent.deleteMany({
    where: {
      userId: {
        in: testUserIds,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: {
        in: testUserIds,
      },
    },
  });

  testUserIds.length = 0;
}

describe("usageRepository", () => {
  beforeEach(async () => {
    await cleanTestRecords();
  });

  afterEach(async () => {
    await cleanTestRecords();
  });

  describe("getUserUsageState", () => {
    it("returns the user's usage fields", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 3,
        monthlyUsageLimit: 5,
      });

      const result =
        await repository.getUserUsageState(
          user.id,
        );

      expect(result).toEqual({
        id: user.id,
        plan: Plan.FREE,
        monthlyUsageLimit: 5,
        monthlyUsageCount: 3,
        usageResetDate:
          new Date(
            "2026-08-01T00:00:00.000Z",
          ),
      });
    });

    it("returns null for an unknown user", async () => {
      const result =
        await repository.getUserUsageState(
          "missing-user-id",
        );

      expect(result).toBeNull();
    });
  });

  describe("resetExpiredUsageWindow", () => {
    it("resets an expired Free usage window", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 5,

        usageResetDate: new Date(
          "2026-07-01T00:00:00.000Z",
        ),
      });

      const now = new Date(
        "2026-07-19T12:00:00.000Z",
      );

      const nextResetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      const result =
        await repository.resetExpiredUsageWindow({
          userId: user.id,
          now,
          nextResetDate,
        });

      expect(result.count).toBe(1);

      const updatedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        updatedUser.monthlyUsageCount,
      ).toBe(0);

      expect(
        updatedUser.usageResetDate,
      ).toEqual(nextResetDate);
    });

    it("initialises a missing usage reset date", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 4,
        usageResetDate: null,
      });

      const nextResetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      const result =
        await repository.resetExpiredUsageWindow({
          userId: user.id,

          now: new Date(
            "2026-07-19T12:00:00.000Z",
          ),

          nextResetDate,
        });

      expect(result.count).toBe(1);

      const updatedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        updatedUser.monthlyUsageCount,
      ).toBe(0);

      expect(
        updatedUser.usageResetDate,
      ).toEqual(nextResetDate);
    });

    it("does not reset a usage window that is still active", async () => {
      const resetDate = new Date(
        "2026-08-01T00:00:00.000Z",
      );

      const user = await createTestUser({
        monthlyUsageCount: 4,
        usageResetDate: resetDate,
      });

      const result =
        await repository.resetExpiredUsageWindow({
          userId: user.id,

          now: new Date(
            "2026-07-19T12:00:00.000Z",
          ),

          nextResetDate: new Date(
            "2026-09-01T00:00:00.000Z",
          ),
        });

      expect(result.count).toBe(0);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(4);

      expect(
        unchangedUser.usageResetDate,
      ).toEqual(resetDate);
    });

    it("does not reset a Pro user's usage", async () => {
      const resetDate = new Date(
        "2026-07-01T00:00:00.000Z",
      );

      const user = await createTestUser({
        plan: Plan.PRO,
        monthlyUsageCount: 20,
        usageResetDate: resetDate,
      });

      const result =
        await repository.resetExpiredUsageWindow({
          userId: user.id,

          now: new Date(
            "2026-07-19T12:00:00.000Z",
          ),

          nextResetDate: new Date(
            "2026-08-01T00:00:00.000Z",
          ),
        });

      expect(result.count).toBe(0);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(20);

      expect(
        unchangedUser.usageResetDate,
      ).toEqual(resetDate);
    });
  });

  describe("reserveFreeUsage", () => {
    it("increments usage for a Free user below the limit", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 2,
        monthlyUsageLimit: 5,
      });

      const reserved =
        await repository.reserveFreeUsage(
          user.id,
        );

      expect(reserved).toBe(true);

      const updatedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        updatedUser.monthlyUsageCount,
      ).toBe(3);
    });

    it("rejects usage when the Free user has reached the limit", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 5,
        monthlyUsageLimit: 5,
      });

      const reserved =
        await repository.reserveFreeUsage(
          user.id,
        );

      expect(reserved).toBe(false);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(5);
    });

    it("does not reserve counted usage for a Pro user", async () => {
      const user = await createTestUser({
        plan: Plan.PRO,
        monthlyUsageCount: 12,
      });

      const reserved =
        await repository.reserveFreeUsage(
          user.id,
        );

      expect(reserved).toBe(false);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(12);
    });

    it("allows exactly five concurrent reservations", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 0,
        monthlyUsageLimit: 5,
      });

      const results = await Promise.all(
        Array.from(
          {
            length: 6,
          },
          () =>
            repository.reserveFreeUsage(
              user.id,
            ),
        ),
      );

      const successfulReservations =
        results.filter(Boolean);

      const rejectedReservations =
        results.filter(
          (result) => !result,
        );

      expect(
        successfulReservations,
      ).toHaveLength(5);

      expect(
        rejectedReservations,
      ).toHaveLength(1);

      const updatedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        updatedUser.monthlyUsageCount,
      ).toBe(5);
    });
  });

  describe("releaseFreeUsage", () => {
    it("decrements a Free user's usage count", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 3,
      });

      const result =
        await repository.releaseFreeUsage(
          user.id,
        );

      expect(result.count).toBe(1);

      const updatedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        updatedUser.monthlyUsageCount,
      ).toBe(2);
    });

    it("does not decrement usage below zero", async () => {
      const user = await createTestUser({
        monthlyUsageCount: 0,
      });

      const result =
        await repository.releaseFreeUsage(
          user.id,
        );

      expect(result.count).toBe(0);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(0);
    });

    it("does not decrement a Pro user's usage", async () => {
      const user = await createTestUser({
        plan: Plan.PRO,
        monthlyUsageCount: 10,
      });

      const result =
        await repository.releaseFreeUsage(
          user.id,
        );

      expect(result.count).toBe(0);

      const unchangedUser =
        await prisma.user.findUniqueOrThrow({
          where: {
            id: user.id,
          },
        });

      expect(
        unchangedUser.monthlyUsageCount,
      ).toBe(10);
    });
  });

  describe("usage events", () => {
    it("creates a usage event", async () => {
      const user = await createTestUser();

      const usageType =
        getTestUsageType();

      const result =
        await repository.createUsageEvent({
          userId: user.id,
          type: usageType,
          resourceId: "resource_test_123",
          tokensUsed: 850,
          costCents: 3,
        });

      expect(result).toMatchObject({
        userId: user.id,
        type: usageType,
        resourceId: "resource_test_123",
        tokensUsed: 850,
        costCents: 3,
      });

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(
        Date,
      );
    });

    it("returns only the requested user's events", async () => {
      const firstUser =
        await createTestUser();

      const secondUser =
        await createTestUser();

      const usageType =
        getTestUsageType();

      await repository.createUsageEvent({
        userId: firstUser.id,
        type: usageType,
        resourceId: "first-resource",
        tokensUsed: 100,
        costCents: 1,
      });

      await repository.createUsageEvent({
        userId: secondUser.id,
        type: usageType,
        resourceId: "second-resource",
        tokensUsed: 200,
        costCents: 2,
      });

      const events =
        await repository.getUsageEvents({
          userId: firstUser.id,
        });

      expect(events).toHaveLength(1);

      expect(events[0]).toMatchObject({
        userId: firstUser.id,
        resourceId: "first-resource",
      });
    });

    it("limits the number of returned events", async () => {
      const user = await createTestUser();

      const usageType =
        getTestUsageType();

      await Promise.all(
        Array.from(
          {
            length: 5,
          },
          (_, index) =>
            repository.createUsageEvent({
              userId: user.id,
              type: usageType,
              resourceId: `resource-${index}`,
              tokensUsed: 100 + index,
              costCents: 1,
            }),
        ),
      );

      const events =
        await repository.getUsageEvents({
          userId: user.id,
          take: 2,
        });

      expect(events).toHaveLength(2);
    });

    it("filters events by usage type", async () => {
      const usageTypes =
        Object.values(UsageType);

      /*
       * This test requires at least two UsageType values.
       */
      if (usageTypes.length < 2) {
        return;
      }

      const user = await createTestUser();

      const firstType = usageTypes[0];
      const secondType = usageTypes[1];

      await repository.createUsageEvent({
        userId: user.id,
        type: firstType,
        resourceId: "first-type-resource",
        tokensUsed: 100,
        costCents: 1,
      });

      await repository.createUsageEvent({
        userId: user.id,
        type: secondType,
        resourceId: "second-type-resource",
        tokensUsed: 200,
        costCents: 2,
      });

      const events =
        await repository.getUsageEvents({
          userId: user.id,
          type: firstType,
        });

      expect(events).toHaveLength(1);

      expect(events[0]?.type).toBe(
        firstType,
      );
    });
  });
});
