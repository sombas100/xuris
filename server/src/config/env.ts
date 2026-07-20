import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requiredNumberEnv(name: string): number {
  const value = Number(requiredEnv(name));

  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a valid number.`);
  }

  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: requiredNumberEnv("PORT"),

  DATABASE_URL: requiredEnv("DATABASE_URL"),
  CLIENT_URL: requiredEnv("CLIENT_URL"),

  OPENAI_API_KEY: requiredEnv("OPENAI_API_KEY"),
  OPENAI_MODEL: requiredEnv("OPENAI_MODEL"),

  AWS_REGION: requiredEnv("AWS_REGION"),
  AWS_ACCESS_KEY_ID: requiredEnv("AWS_ACCESS_KEY_ID"),
  AWS_SECRET_ACCESS_KEY: requiredEnv("AWS_SECRET_ACCESS_KEY"),
  AWS_S3_BUCKET_NAME: requiredEnv("AWS_S3_BUCKET_NAME"),

  STRIPE_SECRET_KEY: requiredEnv("STRIPE_SECRET_KEY"),
  STRIPE_PRO_PRICE_ID: requiredEnv("STRIPE_PRO_PRICE_ID"),
  STRIPE_CHECKOUT_SUCCESS_URL: requiredEnv("STRIPE_CHECKOUT_SUCCESS_URL"),
  STRIPE_CHECKOUT_CANCEL_URL: requiredEnv("STRIPE_CHECKOUT_CANCEL_URL"),
  STRIPE_PORTAL_RETURN_URL: requiredEnv("STRIPE_PORTAL_RETURN_URL"),
  STRIPE_WEBHOOK_SECRET: requiredEnv("STRIPE_WEBHOOK_SECRET"),
};