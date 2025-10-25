/*
  Warnings:

  - Added the required column `chartPair` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "chartPair" TEXT NOT NULL,
ADD COLUMN     "signature" TEXT NOT NULL,
ADD COLUMN     "tradeType" TEXT NOT NULL;
