/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ChatroomRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatroomRole_name_key" ON "ChatroomRole"("name");
