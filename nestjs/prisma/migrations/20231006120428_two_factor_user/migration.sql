-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tfaSecret" TEXT,
ADD COLUMN     "tfaStatus" BOOLEAN NOT NULL DEFAULT false;
