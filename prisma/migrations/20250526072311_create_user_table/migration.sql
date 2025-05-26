-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "socialcredits" INTEGER NOT NULL DEFAULT 0,
    "O" INTEGER NOT NULL DEFAULT 0,
    "C" INTEGER NOT NULL DEFAULT 0,
    "E" INTEGER NOT NULL DEFAULT 0,
    "A" INTEGER NOT NULL DEFAULT 0,
    "N" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_userid_key" ON "User"("userid");
