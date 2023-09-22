/*
  Warnings:

  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME', 'UNAVAILABLE');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "statusId",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ONLINE';

-- DropTable
DROP TABLE "Status";
