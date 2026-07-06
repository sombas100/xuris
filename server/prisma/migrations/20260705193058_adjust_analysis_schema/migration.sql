/*
  Warnings:

  - You are about to drop the column `score` on the `ai_analysis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ai_analysis" DROP COLUMN "score",
ADD COLUMN     "ats_compatibility_score" INTEGER,
ADD COLUMN     "clarity_score" INTEGER,
ADD COLUMN     "education_score" INTEGER,
ADD COLUMN     "experience_score" INTEGER,
ADD COLUMN     "formatting_score" INTEGER,
ADD COLUMN     "grammar_score" INTEGER,
ADD COLUMN     "improvements" JSONB,
ADD COLUMN     "missing_keywords" JSONB,
ADD COLUMN     "overall_score" INTEGER,
ADD COLUMN     "projects_score" INTEGER,
ADD COLUMN     "recommended_job_titles" JSONB,
ADD COLUMN     "strengths" JSONB,
ADD COLUMN     "technical_skills_score" INTEGER,
ADD COLUMN     "weaknesses" JSONB;

-- CreateIndex
CREATE INDEX "ai_analysis_overall_score_idx" ON "ai_analysis"("overall_score");
