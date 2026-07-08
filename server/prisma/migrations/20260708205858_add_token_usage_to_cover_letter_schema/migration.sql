-- AlterTable
ALTER TABLE "cover_letters" ADD COLUMN     "model_used" TEXT,
ADD COLUMN     "output_tokens" INTEGER,
ADD COLUMN     "prompt_tokens" INTEGER,
ADD COLUMN     "total_tokens" INTEGER,
ALTER COLUMN "tone" DROP NOT NULL;
