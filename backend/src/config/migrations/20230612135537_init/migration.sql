-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "minecraftUsername" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER,
    CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adminId", "approved", "id", "minecraftUsername") SELECT "adminId", "approved", "id", "minecraftUsername" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_minecraftUsername_key" ON "User"("minecraftUsername");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
