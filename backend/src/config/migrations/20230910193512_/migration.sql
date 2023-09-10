/*
  Warnings:

  - A unique constraint covering the columns `[minecraftUsername,gameType]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_minecraftUsername_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_minecraftUsername_gameType_key" ON "User"("minecraftUsername", "gameType");
