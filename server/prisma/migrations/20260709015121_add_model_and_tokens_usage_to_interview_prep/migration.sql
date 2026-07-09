-- AlterTable
ALTER TABLE "interview_prep" ADD COLUMN     "model_used" TEXT,
ADD COLUMN     "output_tokens" INTEGER,
ADD COLUMN     "prompt_tokens" INTEGER,
ADD COLUMN     "total_tokens" INTEGER;
