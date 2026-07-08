/*
  Warnings:

  - Added the required column `tone` to the `cover_letters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cover_letters" ADD COLUMN     "tone" TEXT NOT NULL;
