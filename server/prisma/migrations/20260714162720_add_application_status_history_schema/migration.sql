/*
  Warnings:

  - You are about to drop the column `jobUrl` on the `job_applications` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'SCREENING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'FINAL_INTERVIEW';

-- DropIndex
DROP INDEX "job_applications_status_idx";

-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "jobUrl",
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "cover_letter_id" TEXT,
ADD COLUMN     "job_url" TEXT,
ADD COLUMN     "offer_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "application_status_history" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "from_status" "ApplicationStatus",
    "to_status" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_status_history_application_id_idx" ON "application_status_history"("application_id");

-- CreateIndex
CREATE INDEX "application_status_history_application_id_changed_at_idx" ON "application_status_history"("application_id", "changed_at");

-- CreateIndex
CREATE INDEX "job_applications_user_id_status_idx" ON "job_applications"("user_id", "status");

-- CreateIndex
CREATE INDEX "job_applications_user_id_created_at_idx" ON "job_applications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "job_applications_job_post_id_idx" ON "job_applications"("job_post_id");

-- CreateIndex
CREATE INDEX "job_applications_follow_up_date_idx" ON "job_applications"("follow_up_date");

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cover_letter_id_fkey" FOREIGN KEY ("cover_letter_id") REFERENCES "cover_letters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
