import {
  Plan,
} from "../../generated/prisma/enums.js";

import { NotFoundError } from "../../errors/NotFoundError.js";
import { UsageLimitError } from "../../errors/UsageLimitError.js";

import {
  usageRepository,
} from "./usage.repository.js";

import type {
  RecordUsageData,
  UsageReservation,
} from "./usage.types.js";

const repository = usageRepository();

function getNextCalendarMonthStart(
  now = new Date(),
) {
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    ),
  );
}

export const usageService = () => {
  async function reserveUsage(
    userId: string,
  ): Promise<UsageReservation> {
    const user =
      await repository.getUserUsageState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    /*
     * Pro and Team users are unlimited.
     * We still record UsageEvent rows for analytics.
     */
    if (
      user.plan === Plan.PRO ||
      user.plan === Plan.TEAM
    ) {
      return {
        userId,
        counted: false,
        usageResetDate:
          user.usageResetDate,
      };
    }

    const now = new Date();

    const nextResetDate =
      getNextCalendarMonthStart(now);

    await repository.resetExpiredUsageWindow({
      userId,
      now,
      nextResetDate,
    });

    const reserved =
      await repository.reserveFreeUsage(userId);

    if (!reserved) {
      const latestState =
        await repository.getUserUsageState(
          userId,
        );

      throw new UsageLimitError(
        latestState?.usageResetDate
          ? `You have used all 5 AI generations for this month. Your allowance resets on ${latestState.usageResetDate.toLocaleDateString(
              "en-GB",
            )}.`
          : "You have used all 5 AI generations for this month.",
      );
    }

    const updatedState =
      await repository.getUserUsageState(
        userId,
      );

    return {
      userId,
      counted: true,
      usageResetDate:
        updatedState?.usageResetDate ?? null,
    };
  }

  async function releaseUsage(
    reservation: UsageReservation,
  ) {
    if (!reservation.counted) {
      return;
    }

    await repository.releaseFreeUsage(
      reservation.userId,
    );
  }

  async function recordUsage(
    data: RecordUsageData,
  ) {
    return repository.createUsageEvent(data);
  }

  async function getUsageSummary(
    userId: string,
  ) {
    const user =
      await repository.getUserUsageState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    const unlimited =
      user.plan === Plan.PRO ||
      user.plan === Plan.TEAM;

    return {
      plan: user.plan,
      unlimited,

      usageCount:
        user.monthlyUsageCount,

      usageLimit: unlimited
        ? null
        : user.monthlyUsageLimit,

      remaining: unlimited
        ? null
        : Math.max(
            user.monthlyUsageLimit -
              user.monthlyUsageCount,
            0,
          ),

      usageResetDate:
        user.usageResetDate,
    };
  }

  return {
    reserveUsage,
    releaseUsage,
    recordUsage,
    getUsageSummary,
  };
};
