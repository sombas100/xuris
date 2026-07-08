/*
  Warnings:

  - Added the required column `resume_id` to the `cover_letters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cover_letters" ADD COLUMN     "resume_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
