/*
  Warnings:

  - You are about to drop the column `gameType` on the `User` table. All the data in the column will be lost.
  - Added the required column `gameTypeId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GameType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "minecraftUsername" TEXT NOT NULL,
    "gameTypeId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "GameType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("approved", "createdAt", "id", "minecraftUsername", "updatedAt") SELECT "approved", "createdAt", "id", "minecraftUsername", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_minecraftUsername_key" ON "User"("minecraftUsername");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "GameType_name_key" ON "GameType"("name");
