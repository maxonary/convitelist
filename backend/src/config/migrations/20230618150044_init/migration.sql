/*
  Warnings:

  - You are about to drop the `GameType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `gameTypeId` on the `User` table. All the data in the column will be lost.
  - Added the required column `gameType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GameType_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameType";
PRAGMA foreign_keys=on;

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
