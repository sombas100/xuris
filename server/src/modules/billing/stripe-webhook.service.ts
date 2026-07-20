import type Stripe from "stripe";

import { Prisma } from "../../generated/prisma/client.js";

import { billingRepository } from "./billing.repository.js";
import {
  billingService as createBillingService,
} from "./billing.service.js";

const repository = billingRepository();
const billing = createBillingService();

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export const stripeWebhookService = () => {
  async function processEvent(event: Stripe.Event) {
    try {
      await repository.createWebhookEventClaim(
        event.id,
        event.type,
      );
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return {
          duplicate: true,
        };
      }

      throw error;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session =
            event.data.object as Stripe.Checkout.Session;

          await billing.handleCheckoutCompleted(session);

          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription =
            event.data.object as Stripe.Subscription;

          await billing.syncStripeSubscription(
            subscription,
          );

          break;
        }

        case "customer.subscription.deleted": {
          const subscription =
            event.data.object as Stripe.Subscription;

          await billing.handleSubscriptionDeleted(
            subscription,
          );

          break;
        }

        default:
          console.log(
            `Unhandled Stripe event: ${event.type}`,
          );
      }

      return {
        duplicate: false,
      };
    } catch (error) {
      await repository.deleteWebhookEventClaim(
        event.id,
      );

      throw error;
    }
  }

  return {
    processEvent,
  };
};
