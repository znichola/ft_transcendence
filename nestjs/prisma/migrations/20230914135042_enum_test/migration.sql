/*
  Warnings:

  - You are about to drop the column `roleId` on the `ChatroomUser` table. All the data in the column will be lost.
  - You are about to drop the `ChatroomRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ChatroomUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "ChatroomUser" DROP CONSTRAINT "ChatroomUser_roleId_fkey";

-- AlterTable
ALTER TABLE "ChatroomUser" DROP COLUMN "roleId",
ADD COLUMN     "role" "ChatroomUserRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "ChatroomRole";
