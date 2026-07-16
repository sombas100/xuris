import type { Request, Response } from "express";
import type Stripe from "stripe";

import { env } from "../../config/env";
import { stripe } from "../../lib/stripe";

import {
  stripeWebhookService as createStripeWebhookService,
} from "./stripe-webhook.service";

const webhookService = createStripeWebhookService();

export async function stripeWebhookHandler(
  req: Request,
  res: Response,
) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      error: {
        code: "STRIPE_SIGNATURE_MISSING",
        message: "Stripe signature header is missing",
      },
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Invalid Stripe webhook signature";

    console.error(
      "Stripe webhook signature verification failed:",
      message,
    );

    return res.status(400).json({
      success: false,
      error: {
        code: "STRIPE_SIGNATURE_VERIFICATION_FAILED",
        message,
      },
    });
  }

  try {
    const result = await webhookService.processEvent(event);

    return res.status(200).json({
      received: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    console.error(
      `Stripe webhook processing failed for ${event.id}:`,
      error,
    );

    return res.status(500).json({
      success: false,
      error: {
        code: "STRIPE_WEBHOOK_PROCESSING_FAILED",
        message: "The Stripe webhook could not be processed",
      },
    });
  }
}