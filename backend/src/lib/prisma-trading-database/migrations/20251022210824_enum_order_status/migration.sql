/*
  Warnings:

  - The `order_status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Order_Status" AS ENUM ('PENDING', 'FILLED', 'PARTIAL', 'CANCELED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "order_status",
ADD COLUMN     "order_status" "Order_Status" NOT NULL DEFAULT 'PENDING';
