/*
  Warnings:

  - Made the column `clubId` on table `CrewMember` required. This step will fail if there are existing NULL values in that column.
  - Made the column `raceCrewType` on table `Race` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clubId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CrewMember" DROP CONSTRAINT "CrewMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubId_fkey";

-- AlterTable
ALTER TABLE "CrewMember" ALTER COLUMN "clubId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Race" ALTER COLUMN "raceCrewType" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clubId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
