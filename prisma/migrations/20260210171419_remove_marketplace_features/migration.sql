/*
  Warnings:

  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `referredBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `FinancialSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralClick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReferralReward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_orderId_fkey";

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_productId_fkey";

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralClick" DROP CONSTRAINT "ReferralClick_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ReferralReward" DROP CONSTRAINT "ReferralReward_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_referredBy_fkey";

-- DropIndex
DROP INDEX "User_referralCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralCode",
DROP COLUMN "referredBy";

-- DropTable
DROP TABLE "FinancialSubscription";

-- DropTable
DROP TABLE "License";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "ReferralClick";

-- DropTable
DROP TABLE "ReferralReward";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "description" TEXT NOT NULL,
    "productId" TEXT,
    "packageName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
