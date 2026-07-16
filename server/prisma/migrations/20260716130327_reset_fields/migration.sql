/*
  Warnings:

  - Changed the type of `type` on the `usage_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UsageType" AS ENUM ('RESUME_ANALYSIS', 'JOB_COMPARISON', 'INTERVIEW_PREP', 'COVER_LETTER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE_EXPIRED';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'UNPAID';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PAUSED';

-- AlterTable
ALTER TABLE "usage_events" ADD COLUMN     "resource_id" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "UsageType" NOT NULL;

-- CreateIndex
CREATE INDEX "Subscription_stripe_customer_id_idx" ON "Subscription"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_status_idx" ON "Subscription"("user_id", "status");

-- CreateIndex
CREATE INDEX "usage_events_user_id_type_idx" ON "usage_events"("user_id", "type");
