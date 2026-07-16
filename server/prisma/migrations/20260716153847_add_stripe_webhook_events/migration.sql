/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_stripe_customer_id_idx";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "stripe_customer_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripe_customer_id" TEXT;

-- CreateTable
CREATE TABLE "stripe_webhook_events" (
    "id" TEXT NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_webhook_events_stripe_event_id_key" ON "stripe_webhook_events"("stripe_event_id");

-- CreateIndex
CREATE INDEX "stripe_webhook_events_type_idx" ON "stripe_webhook_events"("type");

-- CreateIndex
CREATE INDEX "stripe_webhook_events_processed_at_idx" ON "stripe_webhook_events"("processed_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
