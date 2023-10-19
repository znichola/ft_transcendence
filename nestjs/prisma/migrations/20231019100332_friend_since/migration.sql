/*
  Warnings:

  - Added the required column `since` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "since" TIMESTAMP(3) NOT NULL;
