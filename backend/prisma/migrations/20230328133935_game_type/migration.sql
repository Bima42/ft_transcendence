-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('CLASSIC', 'CUSTOM');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "type" "GameType" NOT NULL DEFAULT 'CLASSIC';
