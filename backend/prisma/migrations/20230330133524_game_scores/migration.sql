-- AlterEnum
ALTER TYPE "GameStatus" ADD VALUE 'ABORTED';

-- AlterTable
ALTER TABLE "UserGame" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
