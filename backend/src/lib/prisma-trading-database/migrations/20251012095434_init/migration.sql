-- CreateTable
CREATE TABLE "Trader" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Trader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "locked" BIGINT NOT NULL DEFAULT 0,
    "available" BIGINT NOT NULL DEFAULT 0,
    "merkleLeaf" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "sell_currency" TEXT NOT NULL,
    "buy_currency" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "price" BIGINT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_status" TEXT NOT NULL,
    "proof" TEXT,
    "newRoot" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "traderId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "proof" TEXT,
    "merkleLeaf" TEXT,
    "txHash" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trader_address_key" ON "Trader"("address");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "Trader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
