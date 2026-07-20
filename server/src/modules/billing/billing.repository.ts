import type {
  Prisma,
} from "../../generated/prisma/client.js";

import {
  Plan,
  SubscriptionStatus,
} from "../../generated/prisma/enums.js";

import { prisma } from "../../lib/prisma.js";

import type {
  SyncSubscriptionData,
} from "./billing.types.js";

type TransactionClient =
  Prisma.TransactionClient;

export const billingRepository = () => {
  async function getUserBillingState(
    userId: string,
  ) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        clerkId: true,
        stripeCustomerId: true,

        email: true,
        firstName: true,
        lastName: true,

        plan: true,
        monthlyUsageLimit: true,
        monthlyUsageCount: true,
        usageResetDate: true,

        subscriptions: {
          orderBy: {
            updatedAt: "desc",
          },

          select: {
            id: true,
            stripeSubscriptionId: true,
            stripePriceId: true,

            plan: true,
            status: true,

            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,

            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async function findUserByStripeCustomerId(
    stripeCustomerId: string,
  ) {
    return prisma.user.findUnique({
      where: {
        stripeCustomerId,
      },

      select: {
        id: true,
        stripeCustomerId: true,
      },
    });
  }

  async function saveStripeCustomerId(
    userId: string,
    stripeCustomerId: string,
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        stripeCustomerId,
      },
    });
  }

  async function findLatestSubscriptionByUserId(
    userId: string,
  ) {
    return prisma.subscription.findFirst({
      where: {
        userId,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async function findActiveSubscriptionByUserId(
    userId: string,
  ) {
    return prisma.subscription.findFirst({
      where: {
        userId,

        status: {
          in: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.TRIALING,
          ],
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async function findSubscriptionByStripeId(
    stripeSubscriptionId: string,
  ) {
    return prisma.subscription.findUnique({
      where: {
        stripeSubscriptionId,
      },
    });
  }

  async function syncSubscription(
    data: SyncSubscriptionData,
  ) {
    const grantsProAccess =
      data.status === SubscriptionStatus.ACTIVE ||
      data.status === SubscriptionStatus.TRIALING;

    return prisma.$transaction(
      async (transaction) => {
        const existing =
          await transaction.subscription.findUnique({
            where: {
              stripeSubscriptionId:
                data.stripeSubscriptionId,
            },
          });

        const subscription = existing
          ? await transaction.subscription.update({
              where: {
                id: existing.id,
              },

              data: {
                userId: data.userId,

                stripePriceId:
                  data.stripePriceId,

                plan: data.plan,
                status: data.status,

                currentPeriodStart:
                  data.currentPeriodStart,

                currentPeriodEnd:
                  data.currentPeriodEnd,

                cancelAtPeriodEnd:
                  data.cancelAtPeriodEnd,
              },
            })
          : await transaction.subscription.create({
              data: {
                userId: data.userId,

                stripeSubscriptionId:
                  data.stripeSubscriptionId,

                stripePriceId:
                  data.stripePriceId,

                plan: data.plan,
                status: data.status,

                currentPeriodStart:
                  data.currentPeriodStart,

                currentPeriodEnd:
                  data.currentPeriodEnd,

                cancelAtPeriodEnd:
                  data.cancelAtPeriodEnd,
              },
            });

        await transaction.user.update({
          where: {
            id: data.userId,
          },

          data: grantsProAccess
            ? {
                plan: Plan.PRO,
                monthlyUsageLimit: 2_147_483_647,
              }
            : {
                plan: Plan.FREE,
                monthlyUsageLimit: 5,
              },
        });

        return subscription;
      },
    );
  }

  async function deactivateSubscription(
    stripeSubscriptionId: string,
  ) {
    const existing =
      await findSubscriptionByStripeId(
        stripeSubscriptionId,
      );

    if (!existing) {
      return null;
    }

    return prisma.$transaction(
      async (transaction) => {
        const subscription =
          await transaction.subscription.update({
            where: {
              id: existing.id,
            },

            data: {
              status:
                SubscriptionStatus.CANCELLED,

              cancelAtPeriodEnd: false,
            },
          });

        await transaction.user.update({
          where: {
            id: existing.userId,
          },

          data: {
            plan: Plan.FREE,
            monthlyUsageLimit: 5,
          },
        });

        return subscription;
      },
    );
  }

  async function createWebhookEventClaim(
    stripeEventId: string,
    type: string,
  ) {
    return prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId,
        type,
      },
    });
  }

  async function findWebhookEvent(
    stripeEventId: string,
  ) {
    return prisma.stripeWebhookEvent.findUnique({
      where: {
        stripeEventId,
      },
    });
  }

  async function deleteWebhookEventClaim(
    stripeEventId: string,
  ) {
    return prisma.stripeWebhookEvent.deleteMany({
      where: {
        stripeEventId,
      },
    });
  }

  return {
    getUserBillingState,
    findUserByStripeCustomerId,
    saveStripeCustomerId,

    findLatestSubscriptionByUserId,
    findActiveSubscriptionByUserId,
    findSubscriptionByStripeId,

    syncSubscription,
    deactivateSubscription,

    createWebhookEventClaim,
    findWebhookEvent,
    deleteWebhookEventClaim,
  };
};
