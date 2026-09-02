/*
  Warnings:

  - You are about to drop the column `providerProfileId` on the `favorites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,serviceListingId]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - Made the column `serviceListingId` on table `favorites` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "providerProfileId",
ALTER COLUMN "serviceListingId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_serviceListingId_key" ON "favorites"("userId", "serviceListingId");
