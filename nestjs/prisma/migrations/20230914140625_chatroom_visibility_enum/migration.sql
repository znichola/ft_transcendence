/*
  Warnings:

  - You are about to drop the column `statusId` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the `ChatroomStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatroomVisibilityStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- DropForeignKey
ALTER TABLE "Chatroom" DROP CONSTRAINT "Chatroom_statusId_fkey";

-- AlterTable
ALTER TABLE "Chatroom" DROP COLUMN "statusId",
ADD COLUMN     "status" "ChatroomVisibilityStatus" NOT NULL DEFAULT 'PUBLIC';

-- DropTable
DROP TABLE "ChatroomStatus";
