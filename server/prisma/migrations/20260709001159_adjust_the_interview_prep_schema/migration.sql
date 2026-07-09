/*
  Warnings:

  - You are about to drop the column `questions` on the `interview_prep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interview_prep" DROP COLUMN "questions",
ADD COLUMN     "behaviouralQuestions" JSONB,
ADD COLUMN     "companyQuestions" JSONB,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "questionsToAsk" JSONB,
ADD COLUMN     "suggestedAnswers" JSONB,
ADD COLUMN     "technicalQuestions" JSONB,
ADD COLUMN     "weaknessAreas" JSONB;
