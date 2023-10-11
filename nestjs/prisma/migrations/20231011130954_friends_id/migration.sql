/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");
