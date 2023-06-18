/*
  Warnings:

  - Added the required column `gameType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "minecraftUsername" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("approved", "createdAt", "id", "minecraftUsername", "updatedAt") SELECT "approved", "createdAt", "id", "minecraftUsername", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_minecraftUsername_key" ON "User"("minecraftUsername");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
