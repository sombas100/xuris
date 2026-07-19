import {
  Plan,
  type UsageType,
} from "../../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";

import type {
  RecordUsageData,
} from "./usage.types";

function isTransactionConflict(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2034"
  );
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export const usageRepository = () => {
  async function getUserUsageState(
    userId: string,
  ) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        plan: true,

        monthlyUsageLimit: true,
        monthlyUsageCount: true,
        usageResetDate: true,
      },
    });
  }

  async function resetExpiredUsageWindow({
    userId,
    now,
    nextResetDate,
  }: {
    userId: string;
    now: Date;
    nextResetDate: Date;
  }) {
    return prisma.user.updateMany({
      where: {
        id: userId,
        plan: Plan.FREE,

        OR: [
          {
            usageResetDate: null,
          },
          {
            usageResetDate: {
              lte: now,
            },
          },
        ],
      },

      data: {
        monthlyUsageCount: 0,
        usageResetDate: nextResetDate,
      },
    });
  }

  async function reserveFreeUsage(
  userId: string,
) {
  const maximumAttempts = 5;

  for (
    let attempt = 1;
    attempt <= maximumAttempts;
    attempt += 1
  ) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const user =
            await transaction.user.findUnique({
              where: {
                id: userId,
              },

              select: {
                plan: true,
                monthlyUsageCount: true,
                monthlyUsageLimit: true,
              },
            });

          if (
            !user ||
            user.plan !== Plan.FREE ||
            user.monthlyUsageCount >=
              user.monthlyUsageLimit
          ) {
            return false;
          }

          const updated =
            await transaction.user.updateMany({
              where: {
                id: userId,
                plan: Plan.FREE,
                monthlyUsageCount:
                  user.monthlyUsageCount,
              },

              data: {
                monthlyUsageCount: {
                  increment: 1,
                },
              },
            });

          return updated.count === 1;
        },
        {
          isolationLevel: "Serializable",
        },
      );
    } catch (error: unknown) {
      const shouldRetry =
        isTransactionConflict(error) &&
        attempt < maximumAttempts;

      if (!shouldRetry) {
        throw error;
      }
      await wait(attempt * 15);
    }
  }

  return false;
}

  async function releaseFreeUsage(
    userId: string,
  ) {
    return prisma.user.updateMany({
      where: {
        id: userId,
        plan: Plan.FREE,

        monthlyUsageCount: {
          gt: 0,
        },
      },

      data: {
        monthlyUsageCount: {
          decrement: 1,
        },
      },
    });
  }

  async function createUsageEvent(
    data: RecordUsageData,
  ) {
    return prisma.usageEvent.create({
      data: {
        userId: data.userId,
        type: data.type,

        resourceId: data.resourceId,
        tokensUsed: data.tokensUsed,
        costCents: data.costCents,
      },
    });
  }

  async function getUsageEvents({
    userId,
    type,
    take = 20,
  }: {
    userId: string;
    type?: UsageType;
    take?: number;
  }) {
    return prisma.usageEvent.findMany({
      where: {
        userId,
        type,
      },

      orderBy: {
        createdAt: "desc",
      },

      take,
    });
  }

  return {
    getUserUsageState,
    resetExpiredUsageWindow,
    reserveFreeUsage,
    releaseFreeUsage,
    createUsageEvent,
    getUsageEvents,
  };
};