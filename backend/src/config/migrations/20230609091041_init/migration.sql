-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "minecraftUsername" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_minecraftUsername_key" ON "User"("minecraftUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
