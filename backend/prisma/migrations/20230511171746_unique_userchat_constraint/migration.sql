/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `UserChat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserChat_userId_chatId_key" ON "UserChat"("userId", "chatId");
