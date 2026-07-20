import type Stripe from "stripe";

import {
  Plan,
  SubscriptionStatus,
} from "../../generated/prisma/enums.js";

import { BadRequestError } from "../../errors/BadRequestError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

import { env } from "../../config/env.js";
import { stripe } from "../../lib/stripe.js";

import { billingRepository } from "./billing.repository.js";

import type {
  BillingStatus,
  StripeSubscriptionWithPeriod,
  SyncSubscriptionData,
} from "./billing.types.js";

const repository = billingRepository();

function unixToDate(
  value: number | null | undefined,
) {
  if (typeof value !== "number") {
    return null;
  }

  return new Date(value * 1000);
}

function getCustomerId(
  customer:
    | string
    | Stripe.Customer
    | Stripe.DeletedCustomer,
) {
  return typeof customer === "string"
    ? customer
    : customer.id;
}

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;

    case "trialing":
      return SubscriptionStatus.TRIALING;

    case "past_due":
      return SubscriptionStatus.PAST_DUE;

    case "unpaid":
      return SubscriptionStatus.UNPAID;

    case "incomplete":
      return SubscriptionStatus.INCOMPLETE;

    case "incomplete_expired":
      return SubscriptionStatus.INCOMPLETE_EXPIRED;

    case "paused":
      return SubscriptionStatus.PAUSED;

    case "canceled":
      return SubscriptionStatus.CANCELLED;

    default:
      return SubscriptionStatus.INACTIVE;
  }
}

function getSubscriptionPeriod(
  subscription: StripeSubscriptionWithPeriod,
) {
  const firstItem =
    subscription.items.data[0];

  const periodStart =
    firstItem?.current_period_start ??
    subscription.current_period_start;

  const periodEnd =
    firstItem?.current_period_end ??
    subscription.current_period_end;

  return {
    currentPeriodStart:
      unixToDate(periodStart),

    currentPeriodEnd:
      unixToDate(periodEnd),
  };
}

async function resolveUserIdFromSubscription(
  subscription: Stripe.Subscription,
) {
  const metadataUserId =
    subscription.metadata.userId;

  if (metadataUserId) {
    return metadataUserId;
  }

  const stripeCustomerId = getCustomerId(
    subscription.customer,
  );

  const user =
    await repository.findUserByStripeCustomerId(
      stripeCustomerId,
    );

  return user?.id ?? null;
}

export const billingService = () => {
  async function getOrCreateStripeCustomer(
    userId: string,
  ) {
    const user =
      await repository.getUserBillingState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const fullName = [
      user.firstName,
      user.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    const customer =
      await stripe.customers.create({
        email: user.email,

        name: fullName || undefined,

        metadata: {
          userId: user.id,
          clerkId: user.clerkId,
        },
      });

    await repository.saveStripeCustomerId(
      user.id,
      customer.id,
    );

    return customer.id;
  }

  async function createCheckoutSession(
    userId: string,
  ) {
    const user =
      await repository.getUserBillingState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    const activeSubscription =
      await repository.findActiveSubscriptionByUserId(
        userId,
      );

    if (
      user.plan === Plan.PRO ||
      activeSubscription
    ) {
      throw new BadRequestError(
        "You already have an active Pro subscription",
        "SUBSCRIPTION_ALREADY_ACTIVE",
      );
    }

    const stripeCustomerId =
      await getOrCreateStripeCustomer(userId);

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer: stripeCustomerId,

        client_reference_id: userId,

        line_items: [
          {
            price: env.STRIPE_PRO_PRICE_ID,
            quantity: 1,
          },
        ],

        success_url:
          env.STRIPE_CHECKOUT_SUCCESS_URL,

        cancel_url:
          env.STRIPE_CHECKOUT_CANCEL_URL,

        allow_promotion_codes: true,

        metadata: {
          userId,
          plan: Plan.PRO,
        },

        subscription_data: {
          metadata: {
            userId,
            plan: Plan.PRO,
          },
        },
      });

    if (!session.url) {
      throw new BadRequestError(
        "Stripe did not return a checkout URL",
        "STRIPE_CHECKOUT_URL_MISSING",
      );
    }

    return {
      url: session.url,
    };
  }

  async function createPortalSession(
    userId: string,
  ) {
    const user =
      await repository.getUserBillingState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    if (!user.stripeCustomerId) {
      throw new BadRequestError(
        "No Stripe customer exists for this account",
        "STRIPE_CUSTOMER_NOT_FOUND",
      );
    }

    const session =
      await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,

        return_url:
          env.STRIPE_PORTAL_RETURN_URL,
      });

    return {
      url: session.url,
    };
  }

  async function getBillingStatus(
    userId: string,
  ): Promise<BillingStatus> {
    const user =
      await repository.getUserBillingState(userId);

    if (!user) {
      throw new NotFoundError(
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    const subscription =
      user.subscriptions.find(
        (item) =>
          Boolean(
            item.stripeSubscriptionId,
          ),
      );

    return {
      plan: user.plan,

      monthlyUsageLimit:
        user.monthlyUsageLimit,

      monthlyUsageCount:
        user.monthlyUsageCount,

      usageResetDate:
        user.usageResetDate,

      subscription: subscription
        ? {
            status: subscription.status,

            stripePriceId:
              subscription.stripePriceId,

            currentPeriodStart:
              subscription.currentPeriodStart,

            currentPeriodEnd:
              subscription.currentPeriodEnd,

            cancelAtPeriodEnd:
              subscription.cancelAtPeriodEnd,
          }
        : null,
    };
  }

  async function syncStripeSubscription(
  subscription: Stripe.Subscription,
) {
  const userId =
    await resolveUserIdFromSubscription(
      subscription,
    );

  if (!userId) {
    throw new NotFoundError(
      "Could not resolve the Xuris user for this Stripe subscription",
      "STRIPE_USER_NOT_FOUND",
    );
  }

  const price =
    subscription.items.data[0]?.price;

  const {
    currentPeriodStart,
    currentPeriodEnd,
  } = getSubscriptionPeriod(
    subscription as StripeSubscriptionWithPeriod,
  );

  const cancelAtPeriodEnd =
    subscription.cancel_at_period_end ||
    subscription.cancel_at !== null;

  const data: SyncSubscriptionData = {
    userId,

    stripeSubscriptionId:
      subscription.id,

    stripePriceId:
      price?.id ?? null,

    plan: Plan.PRO,

    status: mapStripeSubscriptionStatus(
      subscription.status,
    ),

    currentPeriodStart,
    currentPeriodEnd,

    cancelAtPeriodEnd,
  };

  return repository.syncSubscription(data);
}

  async function handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      return null;
    }

    const subscription =
      await stripe.subscriptions.retrieve(
        subscriptionId,
      );

    return syncStripeSubscription(
      subscription,
    );
  }

  async function handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ) {
    return repository.deactivateSubscription(
      subscription.id,
    );
  }

  return {
    createCheckoutSession,
    createPortalSession,
    getBillingStatus,

    syncStripeSubscription,
    handleCheckoutCompleted,
    handleSubscriptionDeleted,
  };
};
