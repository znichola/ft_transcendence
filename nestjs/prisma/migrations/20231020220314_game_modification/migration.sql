/*
  Warnings:

  - The values [UNAVAILABLE] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `typeId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `GameType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ballPosX` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ballPosY` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1PosX` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1PosY` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2PosX` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2PosY` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `special` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME', 'INQUEUE');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ONLINE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_typeId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "typeId",
ADD COLUMN     "ballPosX" INTEGER NOT NULL,
ADD COLUMN     "ballPosY" INTEGER NOT NULL,
ADD COLUMN     "player1PosX" INTEGER NOT NULL,
ADD COLUMN     "player1PosY" INTEGER NOT NULL,
ADD COLUMN     "player2PosX" INTEGER NOT NULL,
ADD COLUMN     "player2PosY" INTEGER NOT NULL,
ADD COLUMN     "special" BOOLEAN NOT NULL,
ALTER COLUMN "player2Score" DROP NOT NULL,
ALTER COLUMN "player2EloChange" DROP NOT NULL;

-- DropTable
DROP TABLE "GameType";
