/*
  Warnings:

  - You are about to drop the column `ballPosX` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `ballPosY` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1PosX` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1PosY` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2PosX` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2PosY` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "ballPosX",
DROP COLUMN "ballPosY",
DROP COLUMN "player1PosX",
DROP COLUMN "player1PosY",
DROP COLUMN "player2PosX",
DROP COLUMN "player2PosY",
ADD COLUMN     "gameStateString" TEXT;
