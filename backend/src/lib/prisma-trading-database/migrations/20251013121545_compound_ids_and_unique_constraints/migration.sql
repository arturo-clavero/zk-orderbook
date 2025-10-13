/*
  Warnings:

  - A unique constraint covering the columns `[traderId,currency]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_traderId_currency_key" ON "Account"("traderId", "currency");
