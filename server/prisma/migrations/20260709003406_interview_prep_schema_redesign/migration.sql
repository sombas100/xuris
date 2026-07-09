/*
  Warnings:

  - You are about to drop the column `behaviouralQuestions` on the `interview_prep` table. All the data in the column will be lost.
  - You are about to drop the column `companyQuestions` on the `interview_prep` table. All the data in the column will be lost.
  - You are about to drop the column `questionsToAsk` on the `interview_prep` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedAnswers` on the `interview_prep` table. All the data in the column will be lost.
  - You are about to drop the column `technicalQuestions` on the `interview_prep` table. All the data in the column will be lost.
  - You are about to drop the column `weaknessAreas` on the `interview_prep` table. All the data in the column will be lost.
  - The `difficulty` column on the `interview_prep` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "InterviewDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "interview_prep" DROP COLUMN "behaviouralQuestions",
DROP COLUMN "companyQuestions",
DROP COLUMN "questionsToAsk",
DROP COLUMN "suggestedAnswers",
DROP COLUMN "technicalQuestions",
DROP COLUMN "weaknessAreas",
ADD COLUMN     "behavioural_questions" JSONB,
ADD COLUMN     "questions_to_ask" JSONB,
ADD COLUMN     "role_specific_questions" JSONB,
ADD COLUMN     "technical_questions" JSONB,
ADD COLUMN     "weakness_areas" JSONB,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "InterviewDifficulty";
