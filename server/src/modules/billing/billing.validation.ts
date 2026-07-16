import { z } from "zod";

export const stripeValidationSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, "Stripe secret key is required"),

  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "Stripe webhook secret is required"),

  STRIPE_PRO_PRICE_ID: z
    .string()
    .min(1, "Stripe Pro price ID is required"),

  STRIPE_CHECKOUT_SUCCESS_URL: z.url(
    "Stripe checkout success URL must be valid",
  ),

  STRIPE_CHECKOUT_CANCEL_URL: z.url(
    "Stripe checkout cancel URL must be valid",
  ),

  STRIPE_PORTAL_RETURN_URL: z.url(
    "Stripe portal return URL must be valid",
  ),
});